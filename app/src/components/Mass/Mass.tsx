import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEditMode } from '../../context/EditModeContext';
import { useHymnTypes } from '../../context/TypesAndBooksContext';
import { HymnDataInterface, MassInterface } from '../../interfaces/interfaces';
import EditBar from '../EditBar/EditBar';
import MassHymnChooser from '../MassHymnChooser';
import './Mass.css';

interface Props {
  massData: MassInterface;
  refreshMassData: (endpoint?: string) => void;
}

const Mass: React.FC<Props> = ({ massData, refreshMassData }) => {
  // Context
  const { editMode } = useEditMode();
  const hymnTypes = useHymnTypes();

  const [localMassData, setLocalMassData] = useState(massData);

  const [hymnsData, setHymnsData] = useState<HymnDataInterface[]>([]);
  const [localHymnsData, setLocalHymnsData] =
    useState<HymnDataInterface[]>(hymnsData);

  // Runs on component load
  useEffect(() => {
    // Get list of hymns for this mass
    axios
      .get(`/masses/${massData.id}/hymns`)
      .then((res) => {
        setHymnsData(res.data);
      })
      .catch((e) => console.error(`Get hymns failed:\n${e}`));
    setLocalMassData(massData);
    // eslint-disable-next-line
  }, [massData]);

  useEffect(() => {
    setLocalHymnsData(hymnsData);
    // eslint-disable-next-line
  }, [hymnsData]);

  const editLocalMassData = (key: keyof MassInterface, data: any) => {
    const updatedMassData = { ...localMassData };
    updatedMassData[key] = data;
    setLocalMassData(updatedMassData);
  };

  const handleMassNameChange = (e: React.ChangeEvent) => {
    const updatedHymnName = (e.target as HTMLTextAreaElement).value;
    editLocalMassData('name', updatedHymnName);
  };

  const handleMassDateTimeChange: React.ChangeEventHandler = (
    e: React.ChangeEvent
  ) => {
    const updatedDateTime = (e.target as HTMLTextAreaElement).value;
    editLocalMassData('dateTime', updatedDateTime);
  };

  const handleSaveChanges = async () => {
    // Update the hymn data
    if (massValid()) {
      const massData = {
        ...localMassData,
        hymns: localHymnsData,
      };

      await axios
        .put(`/masses/${localMassData.id}`, massData)
        .then((res) => {
          alert('Mass saved successfully');
          refreshMassData(res.headers.location);
        })
        .catch((e) => {
          alert(`Error saving mass:\n${e.response.status}: ${e.response.data}`);
        });
    } else {
      let errorStr = `Error(s) in mass:\n\n${massErrors.current}`;
      alert(errorStr);
    }
  };

  const handleDelete = async () => {
    await axios
      .delete(`/masses/${localMassData.id}`)
      .then((res) => {
        alert(`Mass deleted successfully`);
        refreshMassData('');
      })
      .catch((e) => {
        alert(`Error deleting mass:\n${e.response.status}: ${e.response.data}`);
      });
  };

  const handleCancelChanges = () => {
    setLocalMassData(massData);
    setLocalHymnsData(hymnsData);
  };

  // Mass validation
  const massErrors = useRef<string>('');
  const generateErrorString = (hymnIndex: number, error: string) => {
    return `Hymn ${hymnIndex + 1} ${
      hymnTypes[localHymnsData[hymnIndex].hymnTypeId].name
    } - ${error}\n`;
  };
  const massValid = () => {
    let errors = '';
    let massValid = true;

    if (!localMassData.name) {
      massValid = false;
      errors += 'Mass name cannot be blank\n';
    }

    if (!localMassData.dateTime) {
      massValid = false;
      errors += 'Mass date cannot be blank\n';
    }

    localHymnsData.forEach((hymn, index) => {
      if (!hymn.id) {
        massValid = false;
        errors += generateErrorString(index, 'No hymn selected');
      } else if (hymn.fileIds.length === 0) {
        massValid = false;
        errors += generateErrorString(index, 'No files selected');
      }
    });

    massErrors.current = errors;

    return massValid;
  };

  const handleOpenMusic = () => {
    window.open(
      `${process.env.REACT_APP_API_URL}/masses/${localMassData.id}/file`
    );
  };

  return (
    <div>
      <EditBar
        handleSaveChanges={handleSaveChanges}
        handleDelete={handleDelete}
        handleCancelChanges={handleCancelChanges}
      />
      <input
        className="massName"
        disabled={!editMode}
        value={localMassData.name}
        onChange={handleMassNameChange}
      ></input>
      <Form.Control
        className="massDateTime"
        type="datetime-local"
        name="mass_date_time"
        disabled={!editMode}
        value={new Date(localMassData.dateTime).toISOString().slice(0, -1)}
        onChange={handleMassDateTimeChange}
      />

      {localMassData.fileId && (
        <div className="d-grid gap-2">
          <Button variant="primary" onClick={handleOpenMusic}>
            Open Music
          </Button>
        </div>
      )}

      <MassHymnChooser hymnsData={localHymnsData} setHymnsData={setHymnsData} />
    </div>
  );
};

export default Mass;
