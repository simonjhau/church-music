import { useAuth0 } from "@auth0/auth0-react";
import { Typography } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { type File, type Hymn, HymnSchema } from "../../types";
import { parseData } from "../../utils";
// import EditHymnBar from "./EditHymnBar";
import { HymnFilesList } from "./HymnFilesList";

interface Props {
  hymnData: Hymn | null;
  refreshHymnData: (endpoint: string) => void;
  editMode: boolean;
}

export const HymnDisplay: React.FC<Props> = ({
  hymnData,
  refreshHymnData,
  editMode,
}) => {
  const { getAccessTokenSilently } = useAuth0();

  const [localHymnData, setLocalHymnData] = useState(hymnData);
  const [files, setFiles] = useState<File[]>([
    { id: "", name: "", fileTypeId: 0, bookId: 0, hymnNum: 0, comment: "" },
  ]);

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
      // setLocalHymnData(hymnData);
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
      "Error editing local hymn data"
    );
    setLocalHymnData(validHymn);
  };

  const handleHymnNameChange = (e: React.ChangeEvent): void => {
    const updatedHymnName = (e.target as HTMLTextAreaElement).value;
    editLocalHymnData("name", updatedHymnName);
  };

  // const handleLyricsChange = (e: React.ChangeEvent) => {
  //   const updatedLyrics = (e.target as HTMLTextAreaElement).value;
  //   editLocalHymnData("lyrics", updatedLyrics);
  // };

  // const handleSaveChanges = async () => {
  //   // Update the hymn data
  //   const token = await getAccessTokenSilently();
  //   axios
  //     .put(
  //       `/hymns/${localHymnData.id}`,
  //       {
  //         name: localHymnData.name,
  //         lyrics: localHymnData.lyrics,
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     )
  //     .then((res) => {
  //       alert(`Hymn saved successfully`);
  //       refreshHymnData(res.headers.location);
  //     })
  //     .catch((e) => {
  //       alert(`Error saving hymns:\n${e.response.status}: ${e.response.data}`);
  //     });
  // };

  // const handleDelete = async () => {
  //   if (window.confirm(`Are you sure you want to delete`)) {
  //     const token = await getAccessTokenSilently();
  //     await axios
  //       .delete(`/hymns/${localHymnData.id}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then((res) => {
  //         alert(`Hymn deleted successfully`);
  //         refreshHymnData("");
  //       })
  //       .catch((e) => {
  //         alert(
  //           `Error deleting hymn:\n${e.response.status}: ${e.response.data}`
  //         );
  //       });
  //   }
  // };

  // const handleCancelChanges = () => {
  //   setLocalHymnData(hymnData);
  // };

  return (
    <div>
      {localHymnData && (
        <div>
          {/* <EditHymnBar
        handleSaveChanges={handleSaveChanges}
        handleDelete={handleDelete}
        handleCancelChanges={handleCancelChanges}
      /> */}
          <InputBase
            fullWidth
            multiline
            minRows={1}
            inputProps={{
              style: {
                fontSize: 36,
                lineHeight: 2,
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
            refreshHymnData={refreshHymnData}
            editMode={editMode}
          />
          <br />
          <Typography variant="h5">Lyrics</Typography>
          <div className="lyrics">
            <InputBase
              fullWidth
              multiline
              className="lyricsText"
              // disabled={!editMode}
              value={localHymnData.lyrics ? localHymnData.lyrics : ""}
              // onChange={handleLyricsChange}
            ></InputBase>
          </div>
        </div>
      )}
    </div>
  );
};
