import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { Draggable } from 'react-beautiful-dnd';
import SearchBox from './SearchBox.js';
import { useHymnTypes, useBooks, useFileTypes } from './TypesAndBooksContext';
import './masses.css';

const DraggableHymn = ({
  hymnsData,
  hymnIndex,
  setHymnTypeId,
  setHymnName,
  setHymnId,
  setFileIds,
}) => {
  // Context
  const hymnTypes = useHymnTypes();
  const books = useBooks();
  const fileTypes = useFileTypes();

  // Set hymn data once a hymn has been selected
  const setHymnData = (hymn) => {
    setHymnName(hymnIndex, hymn.name);
    setHymnId(hymnIndex, hymn.id);
  };

  const [files, setFiles] = useState([]);

  // Get list of files when hymn data changes
  useEffect(() => {
    const hymnId = hymnsData[hymnIndex].id;
    if (hymnId) {
      axios
        .get(`/files/hymn/${hymnId}`)
        .then((res) => {
          const hymnFiles = res.data;
          // Set files as selected or not
          for (let file of hymnFiles) {
            if (hymnsData[hymnIndex].fileIds.includes(file.id)) {
              file.selected = true;
            } else {
              file.selected = false;
            }
          }
          setFiles(hymnFiles);
        })
        .catch((e) => console.log(`Get files failed ${e}`));
    }
  }, [hymnsData, hymnIndex, setFiles]);

  // Handle hymn type selection
  const handleHymnTypeSelect = (e) => {
    const hymnTypeId = parseInt(e.target.value);
    setHymnTypeId(hymnIndex, hymnTypeId);
  };

  // Handle files being selected
  const handleFileCheckbox = (fileIndex) => {
    const updatedFiles = files.map((file, index) => {
      if (index === fileIndex) {
        file.selected = !file.selected;
      }
      return file;
    });
    setFiles(hymnIndex, updatedFiles);

    // Save selected file IDs in parent component
    const selectedFileIds = [];
    for (const file of updatedFiles) {
      if (file.selected) {
        selectedFileIds.push(file);
      }
    }
    console.log({ selectedFileIds });
    setFileIds(hymnIndex, selectedFileIds);
  };
  console.log(files);
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
                  data={hymnsData[hymnIndex]}
                  setData={setHymnData}
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
                  {files.map((file, fileIndex) => {
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
                        checked={files[fileIndex].selected}
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
