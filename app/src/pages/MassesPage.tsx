import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SearchBox from '../components/general/SearchBox/SearchBox';
import Mass from '../components/Masses/Mass/Mass';
import NewMassButtonModal from '../components/Masses/NewMassButtonModal/NewMassButtonModal';
import { EditModeProvider, useEditMode } from '../context/EditModeContext';
import { MassInterface } from '../interfaces/interfaces';

const MassesPage = () => {
  const { getAccessTokenSilently } = useAuth0();

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

  const refreshMassData = async (endpoint: string = '') => {
    if (endpoint) {
      const token = await getAccessTokenSilently();
      axios
        .get(endpoint, { headers: { Authorization: `Bearer ${token}` } })
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
