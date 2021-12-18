import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import DraggableHymn from './DraggableHymn';
import { HymnDataInterface } from '../interfaces/interfaces';

interface Props {
  hymnsData: HymnDataInterface[];
  setHymnsData: (newHymnsData: HymnDataInterface[]) => void;
}

const DraggableHymnsList: React.FC<Props> = ({ hymnsData, setHymnsData }) => {
  // Reorder hymns after dragging
  const handleOnDragEnd = (res: DropResult) => {
    if (!res.destination) return;
    const reorderedHymns = [...hymnsData];
    const [reorderedItem] = reorderedHymns.splice(res.source.index, 1);
    reorderedHymns.splice(res.destination.index, 0, reorderedItem);
    setHymnsData(reorderedHymns);
  };

  const updateHymnsData = (hymnIndex: number, key: string, data: any) => {
    const updatedHymn = hymnsData.map((hymn, i) => {
      if (i === hymnIndex) {
        // todo
        // @ts-ignore:next-line
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
