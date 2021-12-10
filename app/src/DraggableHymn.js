import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Draggable } from 'react-beautiful-dnd';
import SearchBox from './SearchBox.js';
import { useHymnTypes, useBooks, useFileTypes } from './TypesAndBooksContext';
import './masses.css';

const DraggableHymn = ({
  hymns,
  hymnIndex,
  setHymnTypeId,
  setHymnId,
  setFiles,
}) => {
  const hymnTypes = useHymnTypes();
  const books = useBooks();
  const fileTypes = useFileTypes();

  const handleHymnTypeSelect = (e) => {
    const hymnTypeId = parseInt(e.target.value);
    setHymnTypeId(hymnIndex, hymnTypeId);
  };

  const handleHymnSelect = (hymn) => {
    setHymnId(hymnIndex, hymn.id);
  };

  const handleFileCheckbox = (fileIndex) => {
    const updatedFiles = hymns[hymnIndex].files.map((file, index) => {
      if (index === fileIndex) {
        file.selected = !file.selected;
      }
      return file;
    });

    setFiles(hymnIndex, updatedFiles);
  };

  return (
    <Draggable key={hymnIndex} draggableId={`${hymnIndex}`} index={hymnIndex}>
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
                  aria-label="Select Hymn Type"
                  name="hymnType"
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
                  setSelected={handleHymnSelect}
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
              {hymns[hymnIndex].files.length > 0 && (
                <Col sm="9">
                  {hymns[hymnIndex].files.map((file, fileIndex) => {
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
                        checked={hymns[hymnIndex].files[fileIndex].selected}
                        onChange={(e) => handleFileCheckbox(fileIndex)}
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
