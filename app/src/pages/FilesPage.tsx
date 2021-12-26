import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from '../components/Dropdown';
import FileSelector from '../components/FileSelector';
import Input from '../components/Input';
import SearchBox from '../components/SearchBox';
import {
  useBooks,
  useFileTypes,
  useOtherBookId,
} from '../context/TypesAndBooksContext';
import { HymnInterface } from '../interfaces/interfaces';
import '../styles/Files.css';

const FilesPage: React.FC<{}> = () => {
  // Context
  const fileTypes = useFileTypes();
  const books = useBooks();
  const otherBookId = useOtherBookId();

  // State and event handlers
  const [file, setFile] = useState('');
  const handleFileSelect: React.ChangeEventHandler = (e: React.ChangeEvent) => {
    setFile((e.target as HTMLFormElement).files[0]);
  };

  const [selectedHymn, setSelectedHymn] = useState<HymnInterface>({
    id: '',
    name: '',
    altName: '',
    lyrics: '',
  });

  const [fileTypeId, setFileTypeId] = useState(fileTypes[0].id);
  useEffect(() => {
    setFileTypeId(fileTypes[0].id);
  }, [fileTypes]);
  const handleFileTypeSelect: React.ChangeEventHandler = (
    e: React.ChangeEvent
  ) => {
    setFileTypeId(parseInt((e.target as HTMLSelectElement).value));
  };

  const [bookId, setBookId] = useState(books[0].id);
  useEffect(() => {
    setBookId(books[0].id);
  }, [books]);
  const handleBookSelect: React.ChangeEventHandler = (e: React.ChangeEvent) => {
    const bookId = parseInt((e.target as HTMLSelectElement).value);
    setBookId(bookId);
    if (bookId === otherBookId) {
      setHymnNumber('');
    }
  };

  const [hymnNumber, setHymnNumber] = useState('');
  const handleHymnNumberChange: React.ChangeEventHandler = (
    e: React.ChangeEvent
  ) => {
    const value = (e.target as HTMLSelectElement).value;
    const re = /^[0-9\b]+$/;
    if (value === '' || re.test(value)) {
      setHymnNumber(value);
    }
  };

  const [comment, setComment] = useState('');
  const handleCommentChange: React.ChangeEventHandler = (
    e: React.ChangeEvent
  ) => {
    setComment((e.target as HTMLSelectElement).value);
  };

  // Form Validation
  const formErrors = useRef<string[]>([]);
  const formValid = () => {
    const errors: string[] = [];
    let formValid = true;

    if (file == null) {
      errors.push('File: No file selected');
      formValid = false;
    }

    if (selectedHymn.name === '') {
      errors.push('Hymn Name: Hymn name cannot be blank');
      formValid = false;
    }

    if (selectedHymn.id === '') {
      errors.push('Hymn ID: Hymn ID not valid');
      formValid = false;
    }

    if (fileTypeId > fileTypes.length) {
      errors.push('File Type: Invalid file type');
    }

    if (bookId > books.length) {
      errors.push('Book: Invalid book');
      formValid = false;
    }

    if (bookId !== otherBookId && hymnNumber === '') {
      errors.push('Hymn Number: Hymn number cannot be blank');
      formValid = false;
    }

    formErrors.current = errors;
    return formValid;
  };

  // Form submit
  const submit: React.MouseEventHandler = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (formValid()) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('hymnId', selectedHymn.id);
      formData.append('fileTypeId', fileTypeId.toString());
      formData.append('bookId', bookId.toString());
      formData.append('hymnNum', hymnNumber);
      formData.append('comment', comment);

      await axios
        .post('/files', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          alert('File uploaded successfully');
        })
        .catch((e) => {
          alert(
            `Error uploading file:\n${e.response.status}: ${e.response.data}`
          );
        });
    } else {
      let errorStr = 'Error(s) in form submission:\n\n';
      for (const error of formErrors.current) {
        errorStr += `${error}\n`;
      }
      alert(errorStr);
    }
  };

  return (
    <div className="Upload">
      <Form>
        <FileSelector handleFileSelect={handleFileSelect} />
        <SearchBox
          data={selectedHymn}
          setData={setSelectedHymn}
          apiPath="/hymns"
          placeholder="Hymn Name"
          addLabel={true}
        />
        <Dropdown
          text="File Type"
          options={fileTypes}
          handleSelect={handleFileTypeSelect}
          value={fileTypeId}
        />
        <Dropdown
          text="Book"
          options={books}
          handleSelect={handleBookSelect}
          value={bookId}
        />
        {bookId !== otherBookId && (
          <Input
            label="Hymn Number"
            onChange={handleHymnNumberChange}
            value={hymnNumber}
          />
        )}
        <Input label="Comment" onChange={handleCommentChange} value={comment} />
        <br />
        <div className="d-grid gap-2">
          <Button variant="primary" type="submit" onClick={submit}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FilesPage;
