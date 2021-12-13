import { useState } from 'react';
import Form from 'react-bootstrap/Form';

import SearchBox from '../components/SearchBox.js';
import Hymn from '../components/Hymn';

const HymnsPage = () => {
  const [hymnData, setHymnData] = useState({ name: '' });

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
      {Object.keys(hymnData).length > 1 && <Hymn hymn={hymnData}></Hymn>}
    </div>
  );
};

export default HymnsPage;
