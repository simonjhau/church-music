import { useAuth0 } from "@auth0/auth0-react";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { z } from "zod";

import { useBooks, useFileTypes } from "../../context/TypesAndBooksContext";
import { type File, FileSchema } from "../../types";
import { parseData } from "../../utils";
import { AddEditFileButtonModal } from "./AddEditFileButtonModal";

interface HymnFileLinkProps {
  hymnId: string;
  file: File;
  setFiles: (file: File[]) => void;
  editMode: boolean;
}

export const HymnFileLink: React.FC<HymnFileLinkProps> = ({
  hymnId,
  file,
  setFiles,
  editMode,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const fileTypes = useFileTypes();
  const books = useBooks();

  const handleFileClick: React.MouseEventHandler = (e) => {
    const getFile = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`api/hymns/${hymnId}/files/${file.id}/file`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.open(res.data);
    };

    getFile().catch((e) => {
      alert(`Failed to get music file ${file.id}`);
    });
  };

  const handleDeleteFile = (): void => {
    const deleteFile = async (): Promise<void> => {
      if (window.confirm(`Are you sure you want to delete`)) {
        const token = await getAccessTokenSilently();
        const deleteRes = await axios.delete(
          `api/hymns/${hymnId}/files/${file.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert(deleteRes.data);

        // Get updated hymn
        const filesRes = await axios.get(`api/hymns/${hymnId}/files`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const files = parseData(
          z.array(FileSchema),
          filesRes.data,
          "Problem getting files"
        );
        setFiles(files);
      }
    };

    deleteFile().catch((e) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(`Error deleting file:\n${msg}`);
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={6} sm={3}>
        <Button onClick={handleFileClick}>
          {fileTypes.find((fileType) => fileType.id === file.fileTypeId)?.name}
          {" - "}
          {books.find((book) => book.id === file.bookId)?.bookCode}
          {file.hymnNum ? ` - ${file.hymnNum}` : ""}
          {file.comment ? ` - ${file.comment}` : ""}
        </Button>
      </Grid>
      {editMode && (
        <>
          <AddEditFileButtonModal
            hymnId={hymnId}
            fileId={file.id}
            setFiles={setFiles}
          />

          <IconButton aria-label="delete" onClick={handleDeleteFile}>
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </Grid>
  );
};
