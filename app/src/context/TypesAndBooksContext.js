import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';

const FileTypesContext = React.createContext();
const HymnTypesContext = React.createContext();
const BooksContext = React.createContext();
const OtherBookIdContext = React.createContext();

export const useFileTypes = () => {
  return useContext(FileTypesContext);
};

export const useHymnTypes = () => {
  return useContext(HymnTypesContext);
};

export const useBooks = () => {
  return useContext(BooksContext);
};

export const useOtherBookId = () => {
  return useContext(OtherBookIdContext);
};

export const TypeAndBookProvider = ({ children }) => {
  const [fileTypes, setFileTypes] = useState([{ id: 0, name: '' }]);
  const [hymnTypes, setHymnTypes] = useState([{ id: 0, name: '' }]);
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

    // Get list of hymn types
    axios
      .get('/hymnTypes')
      .then((res) => {
        setHymnTypes(res.data);
      })
      .catch(setHymnTypes([{ id: 0, name: '' }]));

    // Get list of books
    axios
      .get('/books')
      .then((res) => {
        setBooks(res.data);
        otherBookId.current = res.data.find((book) => book.name === 'Other').id;
      })
      .catch(setBooks([{ id: 0, name: '' }]));
  }, [setFileTypes, setBooks]);

  return (
    <FileTypesContext.Provider value={fileTypes}>
      <HymnTypesContext.Provider value={hymnTypes}>
        <BooksContext.Provider value={books}>
          <OtherBookIdContext.Provider value={otherBookId}>
            {children}
          </OtherBookIdContext.Provider>
        </BooksContext.Provider>
      </HymnTypesContext.Provider>
    </FileTypesContext.Provider>
  );
};
