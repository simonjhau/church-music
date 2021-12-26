import axios from 'axios';
import { useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Form from 'react-bootstrap/Form';
import { useHymnTypes } from '../context/TypesAndBooksContext';
import { FileInterface, HymnDataInterface } from '../interfaces/interfaces';
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

  // Get list of files when hymn data changes
  useEffect(() => {
    const hymnId = hymnData.id;

    if (hymnId) {
      axios
        .get(`/files/hymn/${hymnId}`)
        .then((res) => {
          const hymnFiles = res.data.map((file: FileInterface) => {
            if (hymnData.fileIds.includes(file.id)) {
              file['selected'] = true;
            } else {
              file['selected'] = false;
            }
            return file;
          });

          updateHymnsData(hymnIndex, 'files', hymnFiles);
        })
        .catch((e) => console.log(`Get files failed ${e}`));
    }

    // eslint-disable-next-line
  }, [hymnData.id]);

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
  const handleFileCheckboxSelection = (fileIndex: number) => {
    const updatedFiles: FileInterface[] = hymnData.files.map(
      (file: FileInterface, index) => {
        if (index === fileIndex) {
          file.selected = !file.selected;
        }
        return file;
      }
    );

    updateHymnsData(hymnIndex, 'files', updatedFiles);

    // Save selected file IDs in parent component
    const selectedFileIds: string[] = [];
    updatedFiles.forEach((file, index) => {
      if (file.selected) {
        selectedFileIds.push(hymnData.files[index].id);
      }
    });

    updateHymnsData(hymnIndex, 'fileIds', selectedFileIds);
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
              files={hymnData.files}
              onChange={handleFileCheckboxSelection}
            />
          </Form>
        </li>
      )}
    </Draggable>
  );
};

export default DraggableHymn;
