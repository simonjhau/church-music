import "react-quill/dist/quill.snow.css";

import { useAuth0 } from "@auth0/auth0-react";
import { Typography } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";

import { type File, type Hymn, HymnSchema } from "../../types";
import { parseData } from "../../utils";
import { EditHymnBar } from "./EditHymnBar";
import { HymnFilesList } from "./HymnFilesList";

interface Props {
  hymnData: Hymn | null;
  setHymnData: (hymn: Hymn | null) => void;
}

export const HymnDisplay: React.FC<Props> = ({ hymnData, setHymnData }) => {
  const { getAccessTokenSilently } = useAuth0();

  const [editMode, setEditMode] = useState(false);
  const [localHymnData, setLocalHymnData] = useState(hymnData);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const getFiles = async (): Promise<void> => {
      if (hymnData) {
        // Get list of files for this hymns
        const token = await getAccessTokenSilently();
        const res = await axios.get(`/api/hymns/${hymnData.id}/files`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(res.data);
      }
      setLocalHymnData(hymnData);
    };

    getFiles().catch((err) => {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(msg);
    });
  }, [hymnData]);

  const editLocalHymnData = (key: keyof Hymn, data: string): void => {
    const updatedHymnData = { ...localHymnData };
    updatedHymnData[key] = data;
    const validHymn = parseData(
      HymnSchema,
      updatedHymnData,
      "Error editing local hymn data",
    );
    setLocalHymnData(validHymn);
  };

  const handleHymnNameChange = (e: React.ChangeEvent): void => {
    const updatedHymnName = (e.target as HTMLTextAreaElement).value;
    editLocalHymnData("name", updatedHymnName);
  };

  const handleLyricsChange = (updatedLyrics: string): void => {
    editLocalHymnData("lyrics", updatedLyrics);
  };

  const handleSaveChanges = (): void => {
    const saveHymn = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      if (localHymnData) {
        const res = await axios.put(
          `/api/hymns/${localHymnData.id}`,
          {
            name: localHymnData.name,
            lyrics: localHymnData.lyrics,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        alert(`Hymn saved successfully`);
        const hymn = parseData(
          HymnSchema,
          res.data.hymn,
          "Problem saving hymn",
        );
        setHymnData(hymn);
      }
    };

    saveHymn().catch((e) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(`Error saving hymns:\n${msg}`);
    });
  };

  const handleDelete = (): void => {
    const deleteHymn = async (): Promise<void> => {
      if (window.confirm(`Are you sure you want to delete`)) {
        if (localHymnData) {
          const token = await getAccessTokenSilently();
          await axios.delete(`/api/hymns/${localHymnData.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          alert(`Hymn deleted successfully`);
          setHymnData(null);
        }
      }
    };

    deleteHymn().catch((err) => {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`Error saving hymns:\n${msg}`);
    });
  };

  const handleCancelChanges = (): void => {
    setLocalHymnData(hymnData);
  };

  return (
    <div>
      {localHymnData && (
        <div>
          <EditHymnBar
            editMode={editMode}
            setEditMode={setEditMode}
            handleSaveChanges={handleSaveChanges}
            handleDelete={handleDelete}
            handleCancelChanges={handleCancelChanges}
          />
          <InputBase
            disabled={!editMode}
            fullWidth
            multiline
            minRows={1}
            inputProps={{
              style: {
                fontSize: 36,
                lineHeight: 2,
                WebkitTextFillColor: "black",
              },
            }}
            value={localHymnData.name}
            onChange={handleHymnNameChange}
          ></InputBase>
          <br />
          <Typography variant="h5">Music Files</Typography>

          <HymnFilesList
            hymnId={localHymnData.id}
            files={files}
            setFiles={setFiles}
            editMode={editMode}
          />
          <br />
          <Typography variant="h5">Lyrics</Typography>
          <div className="lyrics" style={{ marginTop: 8 }}>
            <div
              className="lyricsText"
              dangerouslySetInnerHTML={{ __html: localHymnData.lyrics ?? "" }}
            />
            {editMode && (
              <ReactQuill
                style={{ marginTop: 20 }}
                theme="snow"
                value={localHymnData.lyrics ? localHymnData.lyrics : ""}
                onChange={handleLyricsChange}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
