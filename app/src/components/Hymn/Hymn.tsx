import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useEditMode } from '../../context/EditModeContext';
import { FileInterface, HymnInterface } from '../../interfaces/interfaces';
import HymnFileLink from '../HymnFileLink';
import './Hymn.css';

interface Props {
  hymn: HymnInterface;
  editHymnData: (key: keyof HymnInterface, data: any) => void;
}

const Hymn: React.FC<Props> = ({ hymn, editHymnData }) => {
  const [files, setFiles] = useState<FileInterface[]>([
    { id: '', name: '', fileTypeId: 0, bookId: 0, hymnNum: 0, comment: '' },
  ]);

  const { editMode } = useEditMode();

  // Runs on component load
  useEffect(() => {
    // Get list of files for this hymns
    axios
      .get(`/hymns/${hymn.id}/files`)
      .then((res) => {
        setFiles(res.data);
      })
      .catch((e) => console.error(`Get files failed:\n${e}`));
  }, [hymn, setFiles]);

  const handleHymnNameChange = (e: React.ChangeEvent) => {
    const updatedHymnName = (e.target as HTMLTextAreaElement).value;
    editHymnData('name', updatedHymnName);
  };

  const handleAltNameChange = (e: React.ChangeEvent) => {
    const updatedHymnName = (e.target as HTMLTextAreaElement).value;
    editHymnData('altName', updatedHymnName);
  };

  const handleDeleteFile = (deletedFileId: string) => {
    const fileToDeleteIndex = files.findIndex(
      (file) => file.id === deletedFileId
    );
    const tempFiles = [...files];
    tempFiles.splice(fileToDeleteIndex, 1);
    setFiles(tempFiles);
  };
  const handleLyricsChange = (e: React.ChangeEvent) => {
    const updatedLyrics = (e.target as HTMLTextAreaElement).value;
    editHymnData('lyrics', updatedLyrics);
  };

  return (
    <div>
      <input
        className="hymnName"
        disabled={!editMode}
        value={hymn.name}
        onChange={handleHymnNameChange}
      ></input>
      <input
        className="altName"
        disabled={!editMode}
        value={hymn.altName ? `(${hymn.altName})` : ''}
        onChange={handleAltNameChange}
      ></input>
      <br />
      <h4>Music Files</h4>
      {files.length > 0 &&
        files.map((file) => {
          return (
            <HymnFileLink
              key={file.id}
              file={file}
              handleDeleteFile={handleDeleteFile}
            />
          );
        })}

      <div className="lyrics">
        <br />
        <h4>Lyrics</h4>
        <TextareaAutosize
          className="lyricsText"
          disabled={!editMode}
          value={hymn.lyrics ? hymn.lyrics : ''}
          onChange={handleLyricsChange}
        ></TextareaAutosize>
      </div>
    </div>
  );
};

export default Hymn;
