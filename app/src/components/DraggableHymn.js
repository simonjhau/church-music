import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { Draggable } from 'react-beautiful-dnd';
import SearchBox from './SearchBox.js';
import { useHymnTypes, useBooks, useFileTypes } from '../TypesAndBooksContext';
import '../styles/masses.css';

const DraggableHymn = ({ hymnsData, hymnIndex, updateHymnData }) => {
  // Context
  const hymnTypes = useHymnTypes();
  const books = useBooks();
  const fileTypes = useFileTypes();

  // Set hymn data once a hymn has been selected
  const setHymnData = (hymn) => {
    updateHymnData(hymnIndex, 'name', hymn.name);
    updateHymnData(hymnIndex, 'id', hymn.id);
  };

  const [filesForHymn, setFilesForHymns] = useState([]);
  const [selectedfiles, setSelectedFiles] = useState([]);

  // Get list of files when hymn data changes
  useEffect(() => {
    const hymnId = hymnsData[hymnIndex].id;
    if (hymnId) {
      axios
        .get(`/files/hymn/${hymnId}`)
        .then((res) => {
          const hymnFiles = res.data;
          setFilesForHymns(hymnFiles);
          console.log(hymnsData[hymnIndex].fileIds);
          // Set the check boxes for selected files
          const checkBoxes = hymnFiles.map((file) => {
            if (hymnsData[hymnIndex].fileIds.includes(file.id)) {
              console.log('true');
              return true;
            } else {
              console.log({ file });
              console.log(hymnsData[hymnIndex].fileIds);

              return false;
            }
          });

          setSelectedFiles(checkBoxes);
        })
        .catch((e) => console.log(`Get files failed ${e}`));
    }
    // eslint-disable-next-line
  }, [hymnsData]);

  // Handle hymn type selection
  const handleHymnTypeSelect = (e) => {
    const hymnTypeId = parseInt(e.target.value);
    updateHymnData(hymnIndex, 'hymnTypeId', hymnTypeId);
  };

  // Handle files being selected
  const handleFileCheckbox = (fileIndex) => {
    const updatedFiles = filesForHymn.map((file, index) => {
      if (index === fileIndex) {
        file.selected = !file.selected;
      }
      return file;
    });
    setFilesForHymns(updatedFiles);

    // Save selected file IDs in parent component
    const selectedFileIds = [];
    for (const file of updatedFiles) {
      if (file.selected) {
        selectedFileIds.push(file);
      }
    }
    // console.log({ selectedFileIds });
    updateHymnData(hymnIndex, 'fileIds', selectedFileIds);
  };

  // console.log(files);
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
              {filesForHymn.length > 0 && (
                <Col sm="9">
                  {filesForHymn.map((file, fileIndex) => {
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
                        checked={selectedfiles[fileIndex]}
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
