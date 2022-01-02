import axios from 'axios';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SearchBox from '../components/General/SearchBox/SearchBox';
import Mass from '../components/Masses/Mass/Mass';
import NewMassButtonModal from '../components/Masses/NewMassButtonModal/NewMassButtonModal';
import { EditModeProvider, useEditMode } from '../context/EditModeContext';
import { MassInterface } from '../interfaces/interfaces';

const MassesPage = () => {
  // Set edit mode to false on first render
  const { setEditMode } = useEditMode();
  useEffect(() => {
    setEditMode(false);
    //eslint-disable-next-line
  }, []);

  const defaultMassData = {
    id: '',
    name: '',
    dateTime: '',
    fileId: '',
  };

  // State and event handlers
  const [massData, setMassData] = useState<MassInterface>(defaultMassData);

  const refreshMassData = (endpoint: string = '') => {
    if (endpoint) {
      axios
        .get(endpoint)
        .then((res) => {
          setMassData(res.data[0]);
        })
        .catch((e) => console.error(`Get mass failed:\n${e}`));
    } else {
      setMassData(defaultMassData);
    }
  };

  return (
    <div className="masses">
      <EditModeProvider>
        <Form.Label>Search for masses</Form.Label>
        <Row>
          <Col className="d-grid" sm={9}>
            <SearchBox
              data={massData}
              setData={setMassData}
              apiPath="/masses"
              placeholder="Mass Name"
              addLabel={false}
            />
          </Col>
          <Col className="d-grid">
            <NewMassButtonModal refreshMassData={refreshMassData} />
          </Col>
        </Row>

        {massData.id && (
          <Mass massData={massData} refreshMassData={refreshMassData} />
        )}
      </EditModeProvider>
    </div>
  );
};

export default MassesPage;
