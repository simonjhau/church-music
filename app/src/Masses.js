import { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableHymn from './DraggableHymn';
import axios from 'axios';
import { useHymnTypes } from './TypesAndBooksContext';
import SearchBox from './SearchBox';
import './masses.css';

const Masses = () => {
  const hymnTypes = useHymnTypes();
  const [massId, setMassId] = useState('');
  const [massName, setMassName] = useState('');

  const handleMassNameSelect = (mass) => {
    if (mass.name) {
      setMassId('');
      setMassName(mass.name);
      if (Object.keys(mass).length > 1) {
        setMassDateTime(mass.dateTime.substring(0, mass.dateTime.length - 1));
        console.log(mass);
        axios
          .get(`/masses/${mass.id}`)
          .then((res) => {
            console.log('returened');
            console.log(res.data);
          })
          .catch(console.log('Get files failed'));
      }
    }
  };

  const [massDateTime, setMassDateTime] = useState('');
  const handleMassDateTimeChange = (e) => {
    console.log(e.target.value);
    setMassDateTime(e.target.value);
  };

  const [hymns, setHymns] = useState([]);

  const setHymnTypeId = (hymnIndex, hymnTypeId) => {
    const updatedHymns = hymns.map((hymn, index) => {
      if (index === hymnIndex) {
        hymn.hymnTypeId = hymnTypeId;
      }
      return hymn;
    });

    setHymns(updatedHymns);
  };

  const setHymnId = (hymnIndex, hymnId) => {
    if (hymnId) {
      const updatedHymns = hymns.map((hymn, index) => {
        if (index === hymnIndex) {
          hymn.id = hymnId;
        }
        return hymn;
      });
      setHymns(updatedHymns);

      axios
        .get(`/files/hymn/${hymnId}`)
        .then((res) => {
          const updatedHymns = hymns.map((hymn, index) => {
            if (index === hymnIndex) {
              hymn.files = res.data.map((file) => {
                file.selected = false;
                return file;
              });
            }
            return hymn;
          });

          setHymns(updatedHymns);
        })
        .catch(console.log('Get files failed'));
    }
  };

  const setFiles = (hymnIndex, files) => {
    const updatedHymns = hymns.map((hymn, index) => {
      if (index === hymnIndex) {
        hymn.files = files;
      }
      return hymn;
    });
    setHymns(updatedHymns);
  };

  // Reorder hymns after dragging
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(hymns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setHymns(items);
  };

  const handleAddHymn = (e) => {
    e.preventDefault();
    setHymns([
      ...hymns,
      {
        hymnTypeId: 0,
        id: ``,
        files: [],
      },
    ]);
  };

  const massErrors = useRef([]);
  const generateErrorString = (hymnIndex, error) => {
    return `Hymn ${hymnIndex + 1} ${
      hymnTypes[hymns[hymnIndex].hymnTypeId].type
    } - ${error}\n`;
  };
  const massValid = () => {
    let errors = '';
    let massValid = true;

    if (!massName) {
      massValid = false;
      errors += 'Mass name cannot be blank\n';
    }

    if (!massDateTime) {
      massValid = false;
      errors += 'Mass date cannot be blank\n';
    }

    for (const [index, hymn] of hymns.entries()) {
      if (!hymn.id) {
        massValid = false;
        errors += generateErrorString(index, 'No hymn selected');
      } else {
        const filesSelected = hymn.files.map((file) => file.selected);
        if (filesSelected.every((value) => !value)) {
          massValid = false;
          errors += generateErrorString(index, 'No files selected');
        }
      }
    }

    massErrors.current = errors;

    return massValid;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (massValid()) {
      const tempHymns = hymns.map((hymn) => {
        const fileIds = hymn.files
          .filter((file) => file.selected)
          .map((file) => file.id);
        console.log(fileIds);
        hymn.fileIds = fileIds;
        return hymn;
      });

      const massData = {
        massName: massName,
        massDateTime: massDateTime,
        hymns: tempHymns,
      };

      await axios
        .post('/masses', massData)
        .then((res) => {
          alert('Mass saved successfully');
        })
        .catch((e) => {
          alert(`Error saving mass:\n${e.response.status}: ${e.response.data}`);
        });
    } else {
      console.log(massErrors.current);
      let errorStr = `Error(s) in mass:\n\n${massErrors.current}`;
      alert(errorStr);
    }
  };

  return (
    <div className="Masses">
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Search for mass</Form.Label>
          <SearchBox
            setSelected={handleMassNameSelect}
            apiPath="/masses"
            placeholder="Mass Name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPlaintextComment">
          <Form.Control
            type="datetime-local"
            name="mass_date_time"
            value={massDateTime}
            onChange={handleMassDateTimeChange}
          />
        </Form.Group>
      </Form>

      <div className="hymnChooser">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {hymns.length > 0 && (
            <Droppable droppableId="hymns">
              {(provided) => (
                <ul
                  className="hymns"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {hymns.map((hymn, hymnIndex) => {
                    return (
                      <DraggableHymn
                        key={hymnIndex}
                        hymns={hymns}
                        hymnIndex={hymnIndex}
                        setHymnTypeId={setHymnTypeId}
                        setHymnId={setHymnId}
                        setFiles={setFiles}
                      />
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          )}
        </DragDropContext>
        <Button variant="outline-primary" onClick={handleAddHymn}>
          +
        </Button>{' '}
        <br />
        <Button variant="primary" onClick={submit}>
          Submit
        </Button>{' '}
      </div>
    </div>
  );
};

export default Masses;
