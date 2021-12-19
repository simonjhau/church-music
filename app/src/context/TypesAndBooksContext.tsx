import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';

// File types
interface FileTypesInterface {
  id: number;
  name: string;
}
const FileTypesContext = React.createContext<FileTypesInterface[]>([
  { id: 0, name: '' },
]);
export const useFileTypes = () => useContext(FileTypesContext);

// Hymn types
export interface HymnTypesInterface {
  id: number;
  name: string;
}
const HymnTypesContext = React.createContext<HymnTypesInterface[]>([
  { id: 0, name: '' },
]);
export const useHymnTypes = () => useContext(HymnTypesContext);

// Books
interface BookInterface {
  id: number;
  name: string;
}
const BooksContext = React.createContext<BookInterface[]>([
  { id: 0, name: '' },
]);
export const useBooks = () => useContext(BooksContext);

const OtherBookIdContext = React.createContext<number>(4);
export const useOtherBookId = () => useContext(OtherBookIdContext);

// Context provider
export const TypeAndBookProvider: React.FC = ({ children }) => {
  const [fileTypes, setFileTypes] = useState(useFileTypes());
  const [hymnTypes, setHymnTypes] = useState(useHymnTypes());
  const [books, setBooks] = useState(useBooks());
  const otherBookId = useRef(useOtherBookId());

  // Runs on page load
  useEffect(() => {
    // Get list of file types
    axios
      .get('/fileTypes')
      .then((res) => {
        setFileTypes(res.data);
      })
      .catch((e: Error) => setFileTypes([{ id: 0, name: '' }]));

    // Get list of hymn types
    axios
      .get('/hymnTypes')
      .then((res) => {
        setHymnTypes(res.data);
      })
      .catch((e: Error) => setHymnTypes([{ id: 0, name: '' }]));

    // Get list of books
    axios
      .get('/books')
      .then((res) => {
        setBooks(res.data);
        otherBookId.current = res.data.find(
          (book: BookInterface) => book.name === 'Other'
        ).id;
      })
      .catch((e: Error) => setBooks([{ id: 0, name: '' }]));
  }, [setFileTypes, setBooks]);

  return (
    <FileTypesContext.Provider value={fileTypes}>
      <HymnTypesContext.Provider value={hymnTypes}>
        <BooksContext.Provider value={books}>
          <OtherBookIdContext.Provider value={otherBookId.current}>
            {children}
          </OtherBookIdContext.Provider>
        </BooksContext.Provider>
      </HymnTypesContext.Provider>
    </FileTypesContext.Provider>
  );
};
