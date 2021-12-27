import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import EditBar from '../components/EditBar/EditBar';
import Hymn from '../components/Hymn/Hymn';
import SearchBox from '../components/SearchBox';
import EditModeProvider, { useEditMode } from '../context/EditModeContext';
import { HymnInterface } from '../interfaces/interfaces';

const HymnsPage = () => {
  // Set edit mode to false on first render
  const { setEditMode } = useEditMode();
  useEffect(() => {
    setEditMode(false);
    //eslint-disable-next-line
  }, []);

  const [hymnData, setHymnData] = useState<HymnInterface>({
    id: '',
    name: '',
    altName: '',
    lyrics: '',
  });

  const [localHymnData, setLocalHymnData] = useState(hymnData);

  useEffect(() => {
    setLocalHymnData(hymnData);
  }, [hymnData]);

  const editLocalHymnData = (key: keyof HymnInterface, data: any) => {
    const updatedHymn = { ...localHymnData };
    updatedHymn[key] = data;
    setLocalHymnData(updatedHymn);
  };

  const handleSaveChanges = () => {
    // Send put request
  };

  const handleCancelChanges = () => {
    setLocalHymnData(hymnData);
  };

  return (
    <div className="Upload">
      <EditModeProvider>
        <EditBar
          itemSelected={hymnData.id !== ''}
          handleSaveChanges={handleSaveChanges}
          handleCancelChanges={handleCancelChanges}
        />
        <Form.Label>Search for hymns</Form.Label>
        <SearchBox
          data={hymnData}
          setData={setHymnData}
          apiPath="/hymns"
          placeholder="Hymn Name"
          addLabel={false}
        />
        {hymnData.id && (
          <Hymn hymn={localHymnData} editHymnData={editLocalHymnData}></Hymn>
        )}
      </EditModeProvider>
    </div>
  );
};

export default HymnsPage;
