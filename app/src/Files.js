import './Files.css';
import { useState, useRef, React } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import {
  useFileTypes,
  useBooks,
  useOtherBookId,
} from './FileTypesAndBooksContext';

const Upload = () => {
  const fileTypes = useFileTypes();
  const books = useBooks();
  const otherBookId = useOtherBookId();

  const [file, setFile] = useState(null);
  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const [hymnName, setHymnName] = useState('');
  const [hymnId, setHymnId] = useState('');
  const handleHymnNameChange = (hymn) => {
    if (hymn.length > 0) {
      setHymnName(hymn[0].name);
      setHymnId(hymn[0].id);
    } else {
      setHymnName('');
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [hymnNameOptions, setOptions] = useState([]);
  const handleHymnNameSearch = (query) => {
    setHymnName(query);
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

  const [fileTypeId, setFileTypeId] = useState(fileTypes[0]);
  const handleFileTypeSelect = (e) => {
    setFileTypeId(parseInt(e.target.value));
  };

  const [bookId, setBookId] = useState(books[0]);
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

  const formErrors = useRef({});
  const formValid = () => {
    const errors = {};
    let formValid = true;

    if (file == null) {
      errors['File'] = 'No file selected';
      formValid = false;
    }

    if (hymnName === '') {
      errors['Hymn Name'] = 'Hymn name cannot be blank';
      formValid = false;
    }

    if (hymnId === '') {
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

  const submit = async (e) => {
    e.preventDefault();

    if (formValid()) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('hymnId', hymnId);
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
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Choose PDF file to upload</Form.Label>
          <Form.Control type="file" onChange={handleFileSelect} />
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextHymnName">
          <Form.Label column sm="3">
            Hymn Name:
          </Form.Label>
          <Col sm="9">
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
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formSelectFileType">
          <Form.Label column sm="3">
            File Type:
          </Form.Label>
          <Col sm="9">
            <Form.Select
              aria-label="Select File Type"
              name="fileType"
              onChange={handleFileTypeSelect}
            >
              {fileTypes.map((fileType) => {
                return (
                  <option key={fileType.id} value={fileType.id}>
                    {fileType.type}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formSelectBook">
          <Form.Label column sm="3">
            Book:
          </Form.Label>
          <Col sm="9">
            <Form.Select
              aria-label="Select Book"
              name="book"
              onInput={handleBookSelect}
            >
              {books.map((book) => {
                return (
                  <option key={book.id} value={book.id}>
                    {book.name}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
        </Form.Group>

        {bookId !== otherBookId.current && (
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextHymnNum"
          >
            <Form.Label column sm="3">
              Hymn Number:
            </Form.Label>
            <Col sm="9">
              <Form.Control
                name="hymnNumber"
                placeholder="Hymn Number"
                value={hymnNumber}
                onChange={handleHymnNumberChange}
              />
            </Col>
          </Form.Group>
        )}

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formPlaintextComment"
          onChange={handleCommentChange}
        >
          <Form.Label column sm="3">
            Comment:
          </Form.Label>
          <Col sm="9">
            <Form.Control ame="comment" placeholder="Comment" />
          </Col>
        </Form.Group>

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

export default Upload;
