import { useEffect, useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import MassHymnChooser from '../components/MassHymnChooser';
import axios from 'axios';
import { useHymnTypes } from '../context/TypesAndBooksContext.js';
import SearchBox from '../components/SearchBox';
import '../styles/masses.css';

const MassesPage = () => {
  // Context
  const hymnTypes = useHymnTypes();

  // State and event handlers
  const [massData, setMassData] = useState({ name: '' });
  const [massName, setMassName] = useState('');

  const [massDateTime, setMassDateTime] = useState('');
  const handleMassDateTimeChange = (e) => {
    setMassDateTime(e.target.value);
  };

  const [hymnsData, setHymnsData] = useState([]);

  // Get mass data when a mass is selected
  useEffect(() => {
    setMassName(massData.name);

    if (massData.id) {
      setMassDateTime(
        massData.dateTime.substring(0, massData.dateTime.length - 1)
      );

      axios
        .get(`/masses/${massData.id}`)
        .then((res) => {
          const newHymns = res.data;
          setHymnsData(newHymns);
        })
        .catch((e) => console.log(`Get hymns for mass failed: ${e}`));
    }
  }, [massData]);

  // Mass validation
  const massErrors = useRef([]);
  const generateErrorString = (hymnIndex, error) => {
    return `Hymn ${hymnIndex + 1} ${
      hymnTypes[hymnsData[hymnIndex].hymnTypeId].type
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

    for (const [index, hymn] of hymnsData.entries()) {
      if (!hymn.id) {
        massValid = false;
        errors += generateErrorString(index, 'No hymn selected');
      } else {
        const filesSelected = hymn.files.map((file) => file.selected);
        if (filesSelected.every((value) => !value)) {
          massValid = false;
          errors += generateErrorString(index, 'No files selected');
        }
      }
    }

    massErrors.current = errors;

    return massValid;
  };

  // Submit mass
  const submit = async (e) => {
    e.preventDefault();

    if (massValid()) {
      const massData = {
        // massName: massName,
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
