import { useAuth0 } from "@auth0/auth0-react";
import DeleteIcon from "@mui/icons-material/Delete";
import LyricsIcon from "@mui/icons-material/Lyrics";
import { Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Draggable } from "react-beautiful-dnd";
import { z } from "zod";

import { useHymnTypes } from "../../context/TypesAndBooksContext";
import { FileSchema, type MassHymn } from "../../types";
import { parseData } from "../../utils";
import { Dropdown } from "../general/Dropdown";
import { SearchBox } from "../general/SearchBox";
import { FileCheckBoxes } from "./FileCheckBoxes";

interface Props {
  massHymn: MassHymn | null;
  hymnIndex: number;
  updateHymnsData: (
    hymnIndex: number,
    key: keyof MassHymn,
    data: MassHymn[typeof key],
  ) => void;
  handleDeleteHymn: (hymnIndex: number) => void;
  disabled?: boolean;
}

const DraggableHymn: React.FC<Props> = ({
  massHymn,
  hymnIndex,
  updateHymnsData,
  handleDeleteHymn,
}) => {
  const { getAccessTokenSilently } = useAuth0();

  // Context
  const hymnTypes = useHymnTypes();

  // Handle hymn type selection
  const handleHymnTypeSelect = (hymnTypeId: number): void => {
    updateHymnsData(hymnIndex, "hymnTypeId", hymnTypeId);
  };

  // Set hymn data once a hymn has been selected
  const setHymnData = (hymn: MassHymn | null): void => {
    const setHymnDataAsync = async (hymn: MassHymn): Promise<void> => {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`/api/hymns/${hymn.id}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const files = res.data;
      const validFiles = parseData(
        z.array(FileSchema),
        files,
        "Problem getting files",
      );
      const fileIds = validFiles.map((file) => file.id);
      updateSelectedFiles(fileIds);
      updateHymnsData(hymnIndex, "id", hymn.id);
    };

    if (hymn) {
      updateHymnsData(hymnIndex, "name", hymn.name);
      setHymnDataAsync(hymn).catch((err) => {
        const msg = err instanceof Error ? err.message : "Unknown error";
        alert(msg);
      });
    }
  };

  // Handle files being selected
  const updateSelectedFiles = (selectedFiles: string[]): void => {
    updateHymnsData(hymnIndex, "fileIds", selectedFiles);
  };

  const handleDelete = (_e: React.MouseEvent): void => {
    handleDeleteHymn(hymnIndex);
  };

  const openInNewTab = (url: string): void => {
    const newWindow = window.open(url, "_blank", "noopener, noreferrer");
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  return (
    <Stack
      className="draggableHymn"
      sx={{ my: 2, bgcolor: "#dee0f1", borderRadius: "0.3em", px: 2, pb: 2 }}
    >
      <Draggable key={hymnIndex} draggableId={`${hymnIndex}`} index={hymnIndex}>
        {(provided) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Grid container>
              <Typography variant="h6" sx={{ flex: 1, p: 2 }}>
                {hymnIndex + 1}
              </Typography>

              <Tooltip title="Delete">
                <IconButton
                  aria-label="delete"
                  sx={{ p: 2, margin: "auto" }}
                  onClick={handleDelete}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Grid>

            <Stack spacing={2}>
              <Dropdown
                label="Hymn Type"
                options={hymnTypes}
                value={massHymn?.hymnTypeId ?? 0}
                setValue={handleHymnTypeSelect}
              />
              <SearchBox
                type="hymn"
                value={massHymn}
                setValue={setHymnData}
                apiUrl="/api/hymns/"
                navigateOnSelection={false}
              />
              {massHymn?.id && (
                <Grid container>
                  <FileCheckBoxes
                    label="Music Files"
                    hymnId={massHymn.id}
                    selectedFileIds={massHymn.fileIds}
                    updateSelectedFiles={updateSelectedFiles}
                    sx={{ flex: 1 }}
                  />
                  <Tooltip title="Music & Lyrics">
                    <IconButton
                      aria-label="lyrics"
                      sx={{ p: 2, height: "fit-content" }}
                      onClick={() => {
                        openInNewTab(`/Hymns/${massHymn?.id}`);
                      }}
                    >
                      <LyricsIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}
            </Stack>
          </li>
        )}
      </Draggable>
    </Stack>
  );
};

export default DraggableHymn;
