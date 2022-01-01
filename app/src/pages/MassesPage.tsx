import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MassHymnChooser from '../components/MassHymnChooser';
import SearchBox from '../components/SearchBox/SearchBox';
import { useHymnTypes } from '../context/TypesAndBooksContext';
import { HymnDataInterface } from '../interfaces/interfaces';
import '../styles/masses.css';

interface MassDataInterface {
  id: string;
  name: string;
  dateTime: string;
}

const MassesPage: React.FC<{}> = () => {
  // Context
  const hymnTypes = useHymnTypes();

  // State and event handlers
  const [massData, setMassData] = useState<MassDataInterface>({
    id: '',
    name: '',
    dateTime: '',
  });
  const [massName, setMassName] = useState('');

  const [massDateTime, setMassDateTime] = useState('');
  const handleMassDateTimeChange: React.ChangeEventHandler = (
    e: React.ChangeEvent
  ) => {
    setMassDateTime((e.target as HTMLInputElement).value);
  };

  const [hymnsData, setHymnsData] = useState<HymnDataInterface[]>([]);

  // Get mass data when a mass is selected
  useEffect(() => {
    setMassName(massData.name);

    if (massData.id) {
      setMassDateTime(
        massData.dateTime.substring(0, massData.dateTime.length - 1)
      );

      axios
        .get(`/masses/${massData.id}/hymns`)
        .then((res) => {
          const newHymns: HymnDataInterface[] = res.data;
          setHymnsData(newHymns);
        })
        .catch((e) => console.error(`Get hymns for mass failed: ${e}`));
    }
  }, [massData]);

  // Mass validation
  const massErrors = useRef<string>('');
  const generateErrorString = (hymnIndex: number, error: string) => {
    return `Hymn ${hymnIndex + 1} ${
      hymnTypes[hymnsData[hymnIndex].hymnTypeId].name
    } - ${error}\n`;
  };

  const massValid = () => {
    let errors = '';
    let massValid = true;

    if (!massName) {
      massValid = false;
      errors += 'Mass name cannot be blank\n';
    }

    if (!massDateTime) {
      massValid = false;
      errors += 'Mass date cannot be blank\n';
    }

    hymnsData.forEach((hymn, index) => {
      if (!hymn.id) {
        massValid = false;
        errors += generateErrorString(index, 'No hymn selected');
      } else if (hymn.fileIds.length === 0) {
        massValid = false;
        errors += generateErrorString(index, 'No files selected');
      }
    });

    massErrors.current = errors;

    return massValid;
  };

  // Submit mass
  const submit: React.MouseEventHandler = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (massValid()) {
      const massData = {
        massName: massName,
        massDateTime: massDateTime,
        hymns: hymnsData,
      };

      await axios
        .post('/masses', massData)
        .then((res) => {
          alert('Mass saved successfully');
        })
        .catch((e) => {
          alert(`Error saving mass:\n${e.response.status}: ${e.response.data}`);
        });
    } else {
      let errorStr = `Error(s) in mass:\n\n${massErrors.current}`;
      alert(errorStr);
    }
  };

  return (
    <div className="masses">
      <Form>
        <Form.Label>Search for mass</Form.Label>
        <SearchBox
          data={massData}
          setData={setMassData}
          apiPath="/masses"
          placeholder="Mass Name"
          addLabel={false}
        />
        <Form.Group className="mb-3" controlId="formPlaintextComment">
          <Form.Control
            type="datetime-local"
            name="mass_date_time"
            value={massDateTime}
            onChange={handleMassDateTimeChange}
          />
        </Form.Group>
      </Form>
      <MassHymnChooser hymnsData={hymnsData} setHymnsData={setHymnsData} />
      <br />
      <Button variant="primary" onClick={submit}>
        Submit
      </Button>{' '}
    </div>
  );
};

export default MassesPage;
