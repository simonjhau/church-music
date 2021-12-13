import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableHymn from '../components/DraggableHymn';
import Button from 'react-bootstrap/Button';

const MassHymnChooser = ({ hymnsData, setHymnsData }) => {
  // Reorder hymns after dragging
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(hymnsData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setHymnsData(items);
  };

  const setHymnTypeId = (hymnIndex, hymnTypeId) => {
    const updatedHymns = hymnsData.map((hymn, index) => {
      if (index === hymnIndex) {
        hymn.hymnTypeId = hymnTypeId;
      }
      return hymn;
    });
    setHymnsData(updatedHymns);
  };

  const setHymnName = (hymnIndex, hymnName) => {
    const updatedHymns = hymnsData.map((hymn, index) => {
      if (index === hymnIndex) {
        hymn.name = hymnName;
      }
      return hymn;
    });
    setHymnsData(updatedHymns);
  };

  const setHymnId = (hymnIndex, hymnId) => {
    if (hymnId) {
      const updatedHymns = hymnsData.map((hymn, index) => {
        if (index === hymnIndex) {
          hymn.id = hymnId;
        }
        return hymn;
      });
      setHymnsData(updatedHymns);
    }
  };

  const setFileIds = (hymnIndex, fileIds) => {
    const updatedHymns = hymnsData.map((hymn, index) => {
      if (index === hymnIndex) {
        hymn.fileIds = fileIds;
      }
      return hymn;
    });
    setHymnsData(updatedHymns);
  };

  const handleAddHymn = (e) => {
    e.preventDefault();
    setHymnsData([
      ...hymnsData,
      {
        id: ``,
        name: '',
        hymnTypeId: 0,
        fileIds: [],
      },
    ]);
  };

  return (
    <div>
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
                      setHymnName={setHymnName}
                      setHymnTypeId={setHymnTypeId}
                      setHymnId={setHymnId}
                      setFileIds={setFileIds}
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
    </div>
  );
};

export default MassHymnChooser;
