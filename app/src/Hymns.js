import { useState } from 'react';
import Form from 'react-bootstrap/Form';

import SearchBox from './SearchBox.js';
import Hymn from './Hymn';

const Hymns = () => {
  const [selectedHymn, setSelectedHymn] = useState({});

  return (
    <div className="Upload">
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Search for hymns</Form.Label>
          <SearchBox
            setSelected={setSelectedHymn}
            apiPath="/hymns"
            placeholder="Hymn Name"
          />
        </Form.Group>
      </Form>

      {Object.keys(selectedHymn).length > 0 && (
        <Hymn hymn={selectedHymn}></Hymn>
      )}
    </div>
  );
};

export default Hymns;
