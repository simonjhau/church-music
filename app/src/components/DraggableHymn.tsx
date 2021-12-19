import { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Draggable } from 'react-beautiful-dnd';
import SearchBox from './SearchBox';
import { useHymnTypes } from '../context/TypesAndBooksContext';
import Dropdown from './Dropdown';
import FileCheckBoxes from './FileCheckBoxes';
import { FileInterface, HymnDataInterface } from '../interfaces/interfaces';
import '../styles/masses.css';

interface HymnInterface {
  id: string;
  name: string;
}

interface Props {
  hymnsData: HymnDataInterface[];
  hymnIndex: number;
  updateHymnsData: (hymnIndex: number, key: string, value: any) => void;
}

const DraggableHymn: React.FC<Props> = ({
  hymnsData,
  hymnIndex,
  updateHymnsData,
}) => {
  // Context
  const hymnTypes = useHymnTypes();

  // Get list of files when hymn data changes
  useEffect(() => {
    const hymnId = hymnsData[hymnIndex].id;

    if (hymnId) {
      axios
        .get(`/files/hymn/${hymnId}`)
        .then((res) => {
          const hymnFiles = res.data.map((file: FileInterface) => {
            if (hymnsData[hymnIndex].fileIds.includes(file.id)) {
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
  }, [hymnsData[hymnIndex].id]);

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
    const updatedFiles: FileInterface[] = hymnsData[hymnIndex].files.map(
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
        selectedFileIds.push(hymnsData[hymnIndex].files[index].id);
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
              value={hymnsData[hymnIndex].hymnTypeId}
            />

            <SearchBox
              data={hymnsData[hymnIndex]}
              setData={setHymnData}
              apiPath="/hymns"
              placeholder="Hymn Name"
              addLabel={true}
            />

            <FileCheckBoxes
              label="Music Files"
              files={hymnsData[hymnIndex].files}
              onChange={handleFileCheckboxSelection}
            />
          </Form>
        </li>
      )}
    </Draggable>
  );
};

export default DraggableHymn;
