import './Files.css';
import { useState, useEffect, useRef, createContext } from 'react';
import axios from 'axios';
import {} from 'dotenv/config';
import Form from 'react-bootstrap/Form';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import Hymn from './Hymn';

export const FileTypesContext = createContext();
export const BooksContext = createContext();

const Hymns = () => {
  const [fileTypes, setFileTypes] = useState([{ id: 0, name: '' }]);
  const [books, setBooks] = useState([{ id: 0, name: '' }]);
  const otherBookId = useRef(4);

  // Runs on page load
  useEffect(() => {
    // Get list of file types
    axios
      .get('/fileTypes')
      .then((res) => {
        setFileTypes(res.data);
      })
      .catch(setFileTypes([{ id: 0, name: '' }]));

    // Get list of books
    axios
      .get('/books')
      .then((res) => {
        setBooks(res.data);
        otherBookId.current = res.data.find((book) => book.name === 'Other').id;
      })
      .catch(setBooks([{ id: 0, name: '' }]));
  }, [setFileTypes, setBooks]);

  const [selectedHymn, setSelectedHymn] = useState({});
  const handleHymnNameChange = (hymn) => {
    if (hymn.length > 0) {
      setSelectedHymn(hymn[0]);
    } else {
      setSelectedHymn({});
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [hymnNameOptions, setOptions] = useState([]);
  const handleHymnNameSearch = (query) => {
    setIsLoading(true);
    makeAndHandleRequest(query)
      .then((options) => {
        setIsLoading(false);
        setOptions(options);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const makeAndHandleRequest = (query) => {
    return axios
      .get('/hymns', { params: { q: query } })
      .then((res) => {
        setOptions(res.data);
      })
      .catch('makeAndHandleRequest failed');
  };

  return (
    <div className="Upload">
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Search for hymns</Form.Label>
          {/* <Form.Control
            name="hymnName"
            placeholder="Hymn Name"
            onChange={handleHymnNameChange}
          /> */}
          <AsyncTypeahead
            id="hymnNameSearch"
            isLoading={isLoading}
            labelKey="name"
            onSearch={handleHymnNameSearch}
            onChange={handleHymnNameChange}
            options={hymnNameOptions}
            placeholder="Hymn Name"
            renderMenuItemChildren={(option) => <p>{option.name}</p>}
          />
        </Form.Group>
      </Form>

      <FileTypesContext.Provider value={fileTypes}>
        <BooksContext.Provider value={books}>
          {Object.keys(selectedHymn).length > 0 && (
            <Hymn hymn={selectedHymn}></Hymn>
          )}
        </BooksContext.Provider>
      </FileTypesContext.Provider>
    </div>
  );
};

export default Hymns;
