import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Button, Row } from 'react-bootstrap';
import { HymnDataInterface } from '../../../interfaces/interfaces';
import DraggableHymn from '../DraggableHymn/DraggableHymn';
import './DraggableHymnsList.css';

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

  // Todo - this can be improved
  const updateHymnsData = (
    hymnIndex: number,
    key: keyof HymnDataInterface,
    data: any
  ) => {
    const updatedHymn = hymnsData.map((hymn, i) => {
      if (i === hymnIndex) {
        hymn[key] = data;
      }
      return hymn;
    });
    setHymnsData(updatedHymn);
  };

  const handleDeleteHymn = (hymnIndex: number) => {
    const tempHymns = [...hymnsData];
    tempHymns.splice(hymnIndex, 1);
    setHymnsData(tempHymns);
  };

  const handleAddHymn = (index: number) => {
    const tempHymns = [...hymnsData];
    tempHymns.splice(index, 0, {
      id: ``,
      name: '',
      hymnTypeId: 0,
      fileIds: [],
    });
    setHymnsData(tempHymns);
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
                    <div key={`${hymnIndex}`}>
                      <Row>
                        <Button
                          variant="outline-primary"
                          className="plusButton"
                          onClick={() => handleAddHymn(hymnIndex)}
                        >
                          +
                        </Button>
                      </Row>
                      <DraggableHymn
                        hymnData={hymnsData[hymnIndex]}
                        hymnIndex={hymnIndex}
                        updateHymnsData={updateHymnsData}
                        handleDeleteHymn={handleDeleteHymn}
                      />
                    </div>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        )}
      </DragDropContext>
      <Row>
        <Button
          variant="outline-primary"
          className="plusButton"
          onClick={() => handleAddHymn(hymnsData.length)}
        >
          +
        </Button>
      </Row>
    </div>
  );
};

export default DraggableHymnsList;
