import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import SearchBox from './SearchBox.js';
import Hymn from './Hymn';
import DraggableHymn from './DraggableHymn';
import './masses.css';

const Masses = () => {
  const [selectedMass, setSelectedMass] = useState({});
  const [hymns, setHymns] = useState([]);

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
        id: `hymn-${hymns.length}`,
        hymnPos: hymns.length,
        hymntypeId: hymns.length,
        hymnId: '',
        hymnName: '',
        fileIds: [],
      },
    ]);
  };

  return (
    <div className="Upload">
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Search for masses</Form.Label>
          <SearchBox
            setSelected={setSelectedMass}
            apiPath="/masses"
            placeholder="Mass Name"
          />
        </Form.Group>
      </Form>

      {Object.keys(selectedMass).length > 0 && (
        <Hymn hymn={selectedMass}></Hymn>
      )}

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
                  {hymns.map((hymn) => {
                    return <DraggableHymn hymn={hymn} key={hymn.id} />;
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
        <Button variant="primary" onClick={handleAddHymn}>
          Submit
        </Button>{' '}
      </div>
    </div>
  );
};

export default Masses;
