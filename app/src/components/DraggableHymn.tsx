import { Draggable } from 'react-beautiful-dnd';
import Form from 'react-bootstrap/Form';
import { useHymnTypes } from '../context/TypesAndBooksContext';
import { HymnDataInterface } from '../interfaces/interfaces';
import '../styles/masses.css';
import Dropdown from './Dropdown';
import FileCheckBoxes from './FileCheckBoxes';
import SearchBox from './SearchBox';

interface HymnInterface {
  id: string;
  name: string;
}

interface Props {
  hymnData: HymnDataInterface;
  hymnIndex: number;
  updateHymnsData: (
    hymnIndex: number,
    key: keyof HymnDataInterface,
    value: any
  ) => void;
}

const DraggableHymn: React.FC<Props> = ({
  hymnData,
  hymnIndex,
  updateHymnsData,
}) => {
  // Context
  const hymnTypes = useHymnTypes();

  // Handle hymn type selection
  const handleHymnTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hymnTypeId = parseInt(e.target.value);
    updateHymnsData(hymnIndex, 'hymnTypeId', hymnTypeId);
  };

  // Set hymn data once a hymn has been selected
  const setHymnData = (hymn: HymnInterface) => {
    updateHymnsData(hymnIndex, 'name', hymn.name);
    updateHymnsData(hymnIndex, 'id', hymn.id);
  };

  // Handle files being selected
  const updateSelectedFiles = (selectedFiles: string[]) => {
    updateHymnsData(hymnIndex, 'fileIds', selectedFiles);
  };

  return (
    <Draggable key={hymnIndex} draggableId={`${hymnIndex}`} index={hymnIndex}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Form>
            <Dropdown
              text="Hymn Type"
              options={hymnTypes}
              handleSelect={handleHymnTypeSelect}
              value={hymnData.hymnTypeId}
            />

            <SearchBox
              data={hymnData}
              setData={setHymnData}
              apiPath="/hymns"
              placeholder="Hymn Name"
              addLabel={true}
            />

            <FileCheckBoxes
              label="Music Files"
              hymnId={hymnData.id}
              selectedFileIds={hymnData.fileIds}
              updateSelectedFiles={updateSelectedFiles}
            />
          </Form>
        </li>
      )}
    </Draggable>
  );
};

export default DraggableHymn;
