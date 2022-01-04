import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SearchBox from '../components/General/SearchBox/SearchBox';
import Hymn from '../components/Hymns/Hymn/Hymn';
import NewHymnButtonModal from '../components/Hymns/NewHymnButtonModal/NewHymnButtonModal';
import EditModeProvider, { useEditMode } from '../context/EditModeContext';
import { HymnInterface } from '../interfaces/interfaces';

const HymnsPage = () => {
  // Set edit mode to false on first render
  const { getAccessTokenSilently } = useAuth0();
  const { setEditMode } = useEditMode();
  useEffect(() => {
    setEditMode(false);
    //eslint-disable-next-line
  }, []);

  const defaultHymnData = {
    id: '',
    name: '',
    altName: '',
    lyrics: '',
  };

  const [hymnData, setHymnData] = useState<HymnInterface>(defaultHymnData);

  const refreshHymnData = async (endpoint: string = '') => {
    if (endpoint) {
      const token = await getAccessTokenSilently();
      axios
        .get(endpoint, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setHymnData(res.data[0]);
        })
        .catch((e) => console.error(`Get hymn failed:\n${e}`));
    } else {
      setHymnData(defaultHymnData);
    }
  };

  return (
    <div className="Upload">
      <EditModeProvider>
        <Form.Label>Search for hymns</Form.Label>
        <Row>
          <Col className="d-grid" sm={9}>
            <SearchBox
              data={hymnData}
              setData={setHymnData}
              apiPath="/hymns"
              placeholder="Hymn Name"
              addLabel={false}
            />
          </Col>
          <Col className="d-grid">
            <NewHymnButtonModal refreshHymnData={refreshHymnData} />
          </Col>
        </Row>

        {hymnData.id && (
          <Hymn hymnData={hymnData} refreshHymnData={refreshHymnData}></Hymn>
        )}
      </EditModeProvider>
    </div>
  );
};

export default HymnsPage;
