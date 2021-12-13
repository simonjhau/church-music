import { useEffect, useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableHymn from '../components/DraggableHymn';
import axios from 'axios';
import { useHymnTypes } from '../TypesAndBooksContext';
import SearchBox from '../components/SearchBox';
import '../styles/masses.css';

const MassesPage = () => {
  // Context
  const hymnTypes = useHymnTypes();

  const [massData, setMassData] = useState({ name: '' });
  const [massName, setMassName] = useState('');

  const [massDateTime, setMassDateTime] = useState('');
  const handleMassDateTimeChange = (e) => {
    setMassDateTime(e.target.value);
  };

  useEffect(() => {
    setMassName(massData.name);

    if (massData.id) {
      setMassDateTime(
        massData.dateTime.substring(0, massData.dateTime.length - 1)
      );

      // Get hymns for mass
      axios
        .get(`/masses/${massData.id}`)
        .then((res) => {
          const newHymns = res.data;
          setHymnData(newHymns);
        })
        .catch((e) => console.log(`Get hymns for mass failed: ${e}`));
    }
  }, [massData]);

  const [hymnsData, setHymnData] = useState([]);

  const updateHymnData = (hymnIndex, key, data) => {
    const updatedHymn = hymnsData.map((hymn, i) => {
      if (i === hymnIndex) {
        hymn[key] = data;
      }
      return hymn;
    });
    setHymnData(updatedHymn);
  };

  // Reorder hymns after dragging
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(hymnsData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setHymnData(items);
  };

  const handleAddHymn = (e) => {
    e.preventDefault();
    setHymnData([
      ...hymnsData,
      {
        id: ``,
        name: '',
        hymnTypeId: 0,
        fileIds: [],
      },
    ]);
  };

  const massErrors = useRef([]);
  const generateErrorString = (hymnIndex, error) => {
    return `Hymn ${hymnIndex + 1} ${
      hymnTypes[hymnsData[hymnIndex].hymnTypeId].type
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

    for (const [index, hymn] of hymnsData.entries()) {
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
      const tempHymns = hymnsData.map((hymn) => {
        const fileIds = hymn.files
          .filter((file) => file.selected)
          .map((file) => file.id);
        hymn.fileIds = fileIds;
        return hymn;
      });

      const massData = {
        // massName: massName,
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
      let errorStr = `Error(s) in mass:\n\n${massErrors.current}`;
      alert(errorStr);
    }
  };

  return (
    <div className="Masses">
      <Form>
        <Form.Label>Search for mass</Form.Label>
        <SearchBox
          data={massData}
          setData={setMassData}
          apiPath="/masses"
          placeholder="Mass Name"
        />

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
          {hymnsData.length > 0 && (
            <Droppable droppableId="hymns">
              {(provided) => (
                <ul
                  className="hymns"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {hymnsData.map((hymn, hymnIndex) => {
                    return (
                      <DraggableHymn
                        key={hymnIndex}
                        hymnsData={hymnsData}
                        hymnIndex={hymnIndex}
                        updateHymnData={updateHymnData}
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

export default MassesPage;
