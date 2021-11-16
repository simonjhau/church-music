import './Files.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {} from 'dotenv/config';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Upload = () => {
  const [fileTypes, setFileTypes] = useState([{ id: 0, name: '' }]);
  const [books, setBooks] = useState([{ id: 0, name: '' }]);
  const [hymnName, setHymnName] = useState('');
  const [selectedBook, setSelectedBook] = useState(0);
  const otherBook = useRef(4);

  useEffect(() => {
    // Get list of file types
    axios
      .get('/fileTypes')
      .then((res) => setFileTypes(res.data))
      .catch(setFileTypes([{ id: 0, name: '' }]));

    // Get list of books
    axios
      .get('/books')
      .then((res) => {
        setBooks(res.data);
        otherBook.current = res.data.find((book) => book.name === 'Other').id;
      })
      .catch(setBooks([{ id: 0, name: '' }]));
  }, [setFileTypes, setBooks]);

  const handleHymnNameChange = (e) => {
    setHymnName(e.target.value);
  };

  const handleBookSelect = (e) => {
    const book = parseInt(e.target.value);
    setSelectedBook(book);
  };

  const submit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="Upload">
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Choose PDF file to upload</Form.Label>
          <Form.Control type="file" />
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextHymnName">
          <Form.Label column sm="3">
            Hymn Name:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              name="hymnName"
              placeholder="Hymn Name"
              onSelect={handleHymnNameChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formSelectFileType">
          <Form.Label column sm="3">
            File Type:
          </Form.Label>
          <Col sm="9">
            <Form.Select aria-label="Select File Type" name="fileType">
              {fileTypes.map((fileType) => {
                return <option key={fileType.id}>{fileType.type}</option>;
              })}
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          onInput={handleBookSelect}
          controlId="formSelectBook"
        >
          <Form.Label column sm="3">
            Book:
          </Form.Label>
          <Col sm="9">
            <Form.Select aria-label="Select Book" name="book">
              {books.map((book) => {
                return <option key={book.id}>{book.name}</option>;
              })}
            </Form.Select>
          </Col>
        </Form.Group>

        {selectedBook !== otherBook.current && (
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextHymnNum"
          >
            <Form.Label column sm="3">
              Hymn Number:
            </Form.Label>
            <Col sm="9">
              <Form.Control name="hymnNumber" placeholder="Hymn Number" />
            </Col>
          </Form.Group>
        )}

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextComment">
          <Form.Label column sm="3">
            Comment:
          </Form.Label>
          <Col sm="9">
            <Form.Control ame="comment" placeholder="Comment" />
          </Col>
        </Form.Group>

        <br />

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Upload;
