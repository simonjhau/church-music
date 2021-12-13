import { useState } from 'react';
import Form from 'react-bootstrap/Form';

import SearchBox from './SearchBox.js';
import Hymn from './Hymn';

const Hymns = () => {
  const [hymnData, setHymnData] = useState({ name: '' });

  return (
    <div className="Upload">
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Search for hymns</Form.Label>
          <SearchBox
            data={hymnData}
            setData={setHymnData}
            apiPath="/hymns"
            placeholder="Hymn Name"
          />
        </Form.Group>
      </Form>

      {Object.keys(hymnData).length > 1 && <Hymn hymn={hymnData}></Hymn>}
    </div>
  );
};

export default Hymns;
