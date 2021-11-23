import './Files.css';
import { useState, useEffect, useRef, createContext } from 'react';
import axios from 'axios';
import {} from 'dotenv/config';
import Form from 'react-bootstrap/Form';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { FileTypeAndBookProvider } from './FileTypesAndBooksContext';
import Hymn from './Hymn';

export const FileTypesContext = createContext();
export const BooksContext = createContext();

const Hymns = () => {
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
      <FileTypeAndBookProvider>
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Search for hymns</Form.Label>
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

        {Object.keys(selectedHymn).length > 0 && (
          <Hymn hymn={selectedHymn}></Hymn>
        )}
      </FileTypeAndBookProvider>
    </div>
  );
};

export default Hymns;
