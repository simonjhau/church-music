import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableHymn from '../components/DraggableHymn';

const DraggableHymnsList = ({ hymnsData, setHymnsData }) => {
  // Reorder hymns after dragging
  const handleOnDragEnd = (card) => {
    if (!card.destination) return;
    const reorderedHymns = [...hymnsData];
    const [reorderedItem] = reorderedHymns.splice(card.source.index, 1);
    reorderedHymns.splice(card.destination.index, 0, reorderedItem);
    setHymnsData(reorderedHymns);
  };

  const updateHymnsData = (hymnIndex, key, data) => {
    const updatedHymn = hymnsData.map((hymn, i) => {
      if (i === hymnIndex) {
        hymn[key] = data;
      }
      return hymn;
    });
    setHymnsData(updatedHymn);
  };

  return (
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
                    updateHymnsData={updateHymnsData}
                  />
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      )}
    </DragDropContext>
  );
};

export default DraggableHymnsList;
