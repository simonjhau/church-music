import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Hymn from '../components/Hymn';
import SearchBox from '../components/SearchBox';
import { HymnInterface } from '../interfaces/interfaces';

const HymnsPage = () => {
  const [hymnData, setHymnData] = useState<HymnInterface>({
    id: '',
    name: '',
    altName: '',
    lyrics: '',
  });

  return (
    <div className="Upload">
      <Form.Label>Search for hymns</Form.Label>
      <SearchBox
        data={hymnData}
        setData={setHymnData}
        apiPath="/hymns"
        placeholder="Hymn Name"
        addLabel={false}
      />
      {hymnData.id && <Hymn hymn={hymnData}></Hymn>}
    </div>
  );
};

export default HymnsPage;
