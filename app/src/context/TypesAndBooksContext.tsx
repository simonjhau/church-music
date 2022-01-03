import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';

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
  bookCode: string;
}
const defaultBook = { id: 0, name: '', bookCode: '' };
const BooksContext = React.createContext<BookInterface[]>([defaultBook]);
export const useBooks = () => useContext(BooksContext);

const OtherBookIdContext = React.createContext<number>(4);
export const useOtherBookId = () => useContext(OtherBookIdContext);

// Context provider
export const TypeAndBookProvider: React.FC = ({ children }) => {
  const [fileTypes, setFileTypes] = useState(useFileTypes());
  const [hymnTypes, setHymnTypes] = useState(useHymnTypes());
  const [books, setBooks] = useState(useBooks());
  const otherBookId = useRef(useOtherBookId());

  const { getAccessTokenSilently } = useAuth0();

  // Runs on page load
  useEffect(() => {
    const getContextFromApi = async () => {
      // Get list of file types
      const token = await getAccessTokenSilently();

      axios
        .get('/fileTypes', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setFileTypes(res.data);
        })
        .catch((e: Error) => setFileTypes([{ id: 0, name: '' }]));

      // Get list of hymn types
      axios
        .get('/hymnTypes', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setHymnTypes(res.data);
        })
        .catch((e: Error) => setHymnTypes([{ id: 0, name: '' }]));

      // Get list of books
      axios
        .get('/books', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setBooks(res.data);
          otherBookId.current = res.data.find(
            (book: BookInterface) => book.name === 'Other'
          ).id;
        })
        .catch((e: Error) => setBooks([defaultBook]));
    };

    getContextFromApi();

    // eslint-disable-next-line
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
