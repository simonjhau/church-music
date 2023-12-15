import "./draggable.css";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";

import { useHymnTypes } from "../../context/TypesAndBooksContext";
import { type MassHymn } from "../../types";
import DraggableHymn from "./DraggableHymn";

interface Props {
  hymnsData: MassHymn[];
  setHymnsData: (newHymnsData: MassHymn[]) => void;
}

const DraggableHymnsList: React.FC<Props> = ({
  hymnsData: massHymns,
  setHymnsData,
}) => {
  const hymnTypes = useHymnTypes();

  // Reorder hymns after dragging
  const handleOnDragEnd = (res: DropResult): void => {
    if (!res.destination) return;
    const reorderedHymns = [...massHymns];
    const [reorderedItem] = reorderedHymns.splice(res.source.index, 1);
    reorderedHymns.splice(res.destination.index, 0, reorderedItem);
    setHymnsData(reorderedHymns);
  };

  // Todo - this can be improved
  const updateHymnsData = (
    hymnIndex: number,
    key: keyof MassHymn,
    data: MassHymn[typeof key],
  ): void => {
    const updatedHymn = massHymns.map((massHymn, i) => {
      if (i === hymnIndex) {
        // @ts-expect-error - to do: fix this
        massHymn[key] = data;
      }
      return massHymn;
    });
    setHymnsData(updatedHymn);
  };

  const handleDeleteHymn = (hymnIndex: number): void => {
    const tempHymns = [...massHymns];
    tempHymns.splice(hymnIndex, 1);
    setHymnsData(tempHymns);
  };

  const handleAddHymn = (index: number): void => {
    const tempHymns = [...massHymns];

    let newHymnTypeId = 0;
    if (index > 0) {
      newHymnTypeId = Math.min(
        tempHymns[index - 1].hymnTypeId + 1,
        hymnTypes.length - 1,
      );
    }

    tempHymns.splice(index, 0, {
      id: ``,
      name: "",
      hymnTypeId: newHymnTypeId,
      fileIds: [],
    });
    setHymnsData(tempHymns);
  };

  return (
    <Stack>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {massHymns.length > 0 && (
          <Droppable droppableId="hymns">
            {(provided) => (
              <Box
                className="hymns"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {massHymns.map((hymn, hymnIndex) => {
                  return (
                    <Stack key={`${hymnIndex}`}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          handleAddHymn(hymnIndex);
                        }}
                        size="small"
                      >
                        +
                      </Button>

                      <DraggableHymn
                        massHymn={massHymns[hymnIndex]}
                        hymnIndex={hymnIndex}
                        updateHymnsData={updateHymnsData}
                        handleDeleteHymn={handleDeleteHymn}
                      />
                    </Stack>
                  );
                })}

                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        )}
      </DragDropContext>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          handleAddHymn(massHymns.length);
        }}
        size="small"
      >
        +
      </Button>
    </Stack>
  );
};

export default DraggableHymnsList;
