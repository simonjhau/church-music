import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import {
  createContext,
  type ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { type Book, type FileType, type HymnType } from "../types";

// File types
const FileTypesContext = createContext<FileType[]>([]);
export const useFileTypes = (): FileType[] => useContext(FileTypesContext);

// Hymn types
const HymnTypesContext = createContext<HymnType[]>([]);
export const useHymnTypes = (): HymnType[] => useContext(HymnTypesContext);

// Books
const BooksContext = createContext<Book[]>([]);
export const useBooks = (): Book[] => useContext(BooksContext);

const OtherBookIdContext = createContext<number>(4);
export const useOtherBookId = (): number => useContext(OtherBookIdContext);

interface Props {
  children?: ReactElement;
}

// Context provider
export const TypeAndBookProvider = ({ children }: Props): ReactElement => {
  const [fileTypes, setFileTypes] = useState(useFileTypes());
  const [hymnTypes, setHymnTypes] = useState(useHymnTypes());
  const [books, setBooks] = useState(useBooks());
  const otherBookId = useRef(useOtherBookId());

  const { getAccessTokenSilently } = useAuth0();

  // Runs on page load
  useEffect(() => {
    const getContextFromApi = async (): Promise<void> => {
      // Get list of file types
      const token = await getAccessTokenSilently();

      const fileTypesRes = await axios.get("/api/fileTypes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFileTypes(fileTypesRes.data);

      // Get list of hymn types
      const hymnTypesRes = await axios.get("/api/hymnTypes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHymnTypes(hymnTypesRes.data);

      // Get list of books
      const booksRes = await axios.get("/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(booksRes.data);
      otherBookId.current = booksRes.data.find(
        (book: Book) => book.name === "Other",
      ).id;
    };

    getContextFromApi().catch((err) => {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(msg);
    });
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
