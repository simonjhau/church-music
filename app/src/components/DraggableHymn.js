import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Draggable } from 'react-beautiful-dnd';
import SearchBox from './SearchBox.js';
import { useHymnTypes } from '../context/TypesAndBooksContext.js';
import Dropdown from './Dropdown.js';
import FileCheckBoxes from './FileCheckBoxes.js';
import '../styles/masses.css';

const DraggableHymn = ({ hymnsData, hymnIndex, updateHymnsData }) => {
  // Context
  const hymnTypes = useHymnTypes();

  // Set hymn data once a hymn has been selected
  const setHymnData = (hymn) => {
    updateHymnsData(hymnIndex, 'name', hymn.name);
    updateHymnsData(hymnIndex, 'id', hymn.id);
  };

  const [filesForHymn, setFilesForHymns] = useState([]);

  // Get list of files when hymn data changes
  useEffect(() => {
    console.log('useEffect');
    console.log(hymnIndex);
    const hymnId = hymnsData[hymnIndex].id;

    setFilesForHymns([]);

    if (hymnId) {
      axios
        .get(`/files/hymn/${hymnId}`)
        .then((res) => {
          const hymnFiles = res.data.map((file) => {
            if (hymnsData[hymnIndex].fileIds.includes(file.id)) {
              file['selected'] = true;
            } else {
              file['selected'] = false;
            }
            return file;
          });

          setFilesForHymns(hymnFiles);
        })
        .catch((e) => console.log(`Get files failed ${e}`));
    }

    // eslint-disable-next-line
  }, [hymnsData[hymnIndex].id]);

  // Handle hymn type selection
  const handleHymnTypeSelect = (e) => {
    const hymnTypeId = parseInt(e.target.value);
    updateHymnsData(hymnIndex, 'hymnTypeId', hymnTypeId);
  };

  // Handle files being selected
  const handleFileCheckboxSelection = (fileIndex) => {
    const updatedFiles = filesForHymn.map((file, index) => {
      if (index === fileIndex) {
        file.selected = !file.selected;
      }
      return file;
    });

    setFilesForHymns(updatedFiles);

    // Save selected file IDs in parent component
    const selectedFileIds = [];
    for (const [index, file] of updatedFiles.entries()) {
      if (file.selected) {
        selectedFileIds.push(filesForHymn[index].id);
      }
    }
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
              files={filesForHymn}
              onChange={handleFileCheckboxSelection}
            />
          </Form>
        </li>
      )}
    </Draggable>
  );
};

export default DraggableHymn;
