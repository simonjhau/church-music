import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Draggable } from 'react-beautiful-dnd';
import { Form } from 'react-bootstrap';
import { useHymnTypes } from '../../../context/TypesAndBooksContext';
import {
  FileInterface,
  HymnDataInterface,
  HymnInterface,
} from '../../../interfaces/interfaces';
import Dropdown from '../../General/Dropdown/Dropdown';
import SearchBox from '../../General/SearchBox/SearchBox';
import FileCheckBoxes from '../FileCheckBoxes/FileCheckBoxes';
import HymnCardHeader from '../HymnCardHeader/HymnCardHeader';
import './DraggableHymn.css';

interface Props {
  hymnData: HymnDataInterface;
  hymnIndex: number;
  updateHymnsData: (
    hymnIndex: number,
    key: keyof HymnDataInterface,
    value: any
  ) => void;
  handleDeleteHymn: (hymnIndex: number) => void;
  disabled?: boolean;
}

const DraggableHymn: React.FC<Props> = ({
  hymnData,
  hymnIndex,
  updateHymnsData,
  handleDeleteHymn,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  // Context
  const hymnTypes = useHymnTypes();

  // Handle hymn type selection
  const handleHymnTypeSelect = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const hymnTypeId = parseInt(e.target.value);
    updateHymnsData(hymnIndex, 'hymnTypeId', hymnTypeId);
  };

  // Set hymn data once a hymn has been selected
  const setHymnData = async (hymn: HymnInterface) => {
    // Set all files as selected
    const token = await getAccessTokenSilently();
    axios
      .get(`/hymns/${hymn.id}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const fileIds = (res.data as FileInterface[]).map((file) => file.id);
        updateSelectedFiles(fileIds);
        updateHymnsData(hymnIndex, 'name', hymn.name);
        updateHymnsData(hymnIndex, 'id', hymn.id);
      });
  };

  // Handle files being selected
  const updateSelectedFiles = (selectedFiles: string[]) => {
    updateHymnsData(hymnIndex, 'fileIds', selectedFiles);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDeleteHymn(hymnIndex);
  };

  return (
    <div className="draggableHymn">
      <Draggable key={hymnIndex} draggableId={`${hymnIndex}`} index={hymnIndex}>
        {(provided) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <HymnCardHeader hymnIndex={hymnIndex} handleDelete={handleDelete} />

            <Form>
              <Dropdown
                text="Hymn Type"
                options={hymnTypes}
                handleSelect={handleHymnTypeSelect}
                value={hymnData.hymnTypeId}
                size="sm"
              />

              <SearchBox
                data={hymnData}
                setData={setHymnData}
                apiPath="/hymns"
                placeholder="Hymn Name"
                addLabel={true}
                size="sm"
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
    </div>
  );
};

export default DraggableHymn;
