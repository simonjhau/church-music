import '../styles/Files.css';
import { useEffect, useState, useRef, React } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
  useFileTypes,
  useBooks,
  useOtherBookId,
} from '../context/TypesAndBooksContext.js';
import SearchBox from '../components/SearchBox.js';
import FileSelector from '../components/FileSelector.js';
import Dropdown from '../components/Dropdown.js';
import Input from '../components/Input.js';

const FilesPage = () => {
  // Context
  const fileTypes = useFileTypes();
  const books = useBooks();
  const otherBookId = useOtherBookId();

  // State and event handlers
  const [file, setFile] = useState(null);
  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const [selectedHymn, setSelectedHymn] = useState({ name: '' });

  const [fileTypeId, setFileTypeId] = useState(fileTypes[0].id);
  useEffect(() => {
    setFileTypeId(fileTypes[0].id);
  }, [fileTypes]);
  const handleFileTypeSelect = (e) => {
    setFileTypeId(parseInt(e.target.value));
  };

  const [bookId, setBookId] = useState(books[0].id);
  useEffect(() => {
    setBookId(books[0].id);
  }, [books]);
  const handleBookSelect = (e) => {
    const bookId = parseInt(e.target.value);
    setBookId(bookId);
    if (bookId === otherBookId.current) {
      setHymnNumber('');
    }
  };

  const [hymnNumber, setHymnNumber] = useState('');
  const handleHymnNumberChange = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setHymnNumber(e.target.value);
    }
  };

  const [comment, setComment] = useState('');
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // Form Validation
  const formErrors = useRef({});
  const formValid = () => {
    const errors = {};
    let formValid = true;

    if (file == null) {
      errors['File'] = 'No file selected';
      formValid = false;
    }

    if (selectedHymn.name === '') {
      errors['Hymn Name'] = 'Hymn name cannot be blank';
      formValid = false;
    }

    if (selectedHymn.id === '') {
      errors['Hymn Id'] = 'Hymn ID not valid';
      formValid = false;
    }

    if (fileTypeId > fileTypes.length) {
      errors['File Type'] = 'Invalid file type';
      formValid = false;
    }

    if (bookId > books.length) {
      errors['Book'] = 'Invalid book';
      formValid = false;
    }

    if (bookId !== otherBookId.current && hymnNumber === '') {
      errors['Hymn Number'] = 'Hymn number cannot be blank';
      formValid = false;
    }

    formErrors.current = errors;
    return formValid;
  };

  // Form submit
  const submit = async (e) => {
    e.preventDefault();

    if (formValid()) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('hymnId', selectedHymn.id);
      formData.append('fileTypeId', fileTypeId);
      formData.append('bookId', bookId);
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
      for (const key of Object.keys(formErrors.current)) {
        errorStr += `${key}: ${formErrors.current[key]}\n`;
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
        />
        <Dropdown text="Book" options={books} handleSelect={handleBookSelect} />
        {bookId !== otherBookId.current && (
          <Input
            label="Hymn Number"
            onChange={handleHymnNumberChange}
            value={hymnNumber}
          />
        )}
        <Input label="Comment" onChange={handleCommentChange} />
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
