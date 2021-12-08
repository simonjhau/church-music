import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { Draggable } from 'react-beautiful-dnd';
import SearchBox from './SearchBox.js';
import { useHymnTypes, useBooks, useFileTypes } from './TypesAndBooksContext';
import './masses.css';

const DraggableHymn = ({ hymn }) => {
  const hymnTypes = useHymnTypes();
  const books = useBooks();
  const fileTypes = useFileTypes();
  const [selectedHymnType, setSelectedHymnType] = useState(0);
  const [selectedHymn, setSelectedHymn] = useState({});
  const [files, setFiles] = useState([]);

  const handleHymnTypeSelect = (e) => {
    const hymnType = parseInt(e.target.value);
    setSelectedHymnType(hymnType);
  };

  useEffect(() => {
    if (Object.keys(selectedHymn).length > 0) {
      axios
        .get(`/files/hymn/${selectedHymn.id}`)
        .then((res) => {
          setFiles(res.data);
        })
        .catch(console.log('Get files failed'));
    }
  }, [selectedHymn, setFiles]);

  return (
    <Draggable key={hymn.id} draggableId={hymn.id} index={hymn.hymnPos}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="formSelectBook">
              <Form.Label column sm="3">
                Hymn Type:
              </Form.Label>
              <Col sm="9">
                <Form.Select
                  aria-label="Select Book"
                  name="book"
                  onInput={handleHymnTypeSelect}
                >
                  {hymnTypes.map((hymnType) => {
                    return (
                      <option key={hymnType.id} value={hymnType.id}>
                        {hymnType.type}
                      </option>
                    );
                  })}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextHymnName"
            >
              <Form.Label column sm="3">
                Hymn Name:
              </Form.Label>
              <Col sm="9">
                <SearchBox
                  setSelected={setSelectedHymn}
                  apiPath="/hymns"
                  placeholder="Hymn Name"
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextHymnName"
            >
              <Form.Label column sm="3">
                Music Files:
              </Form.Label>
              {files.length > 0 && (
                <Col sm="9">
                  {files.map((file) => {
                    return (
                      <Form.Check
                        type="checkbox"
                        id={file.id}
                        key={file.id}
                        label={`
                          ${
                            fileTypes.find(
                              (fileType) => fileType.id === file.fileTypeId
                            )?.type
                          } - ${
                          books.find((book) => book.id === file.bookId)?.name
                        } ${file.hymnNum ? ` - ${file.hymnNum}` : ''} ${
                          file.comment ? ` - ${file.comment}` : ''
                        }`}
                      />
                    );
                  })}
                </Col>
              )}
            </Form.Group>
          </Form>
        </li>
      )}
    </Draggable>
  );
};

export default DraggableHymn;
