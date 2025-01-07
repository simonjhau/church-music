import { useAuth0 } from "@auth0/auth0-react";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import {
  type ChangeEvent,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { z } from "zod";

import {
  useBooks,
  useFileTypes,
  useOtherBookId,
} from "../../context/TypesAndBooksContext";
import { type File as FileParams, FileSchema } from "../../types";
import { parseData } from "../../utils";
import { Dropdown } from "../general/Dropdown";

interface AddEditFileModalProps {
  hymnId: string;
  fileId: string | null;
  setFiles: (file: FileParams[]) => void;
}

export const AddEditFileButtonModal = ({
  hymnId,
  fileId,
  setFiles,
}: AddEditFileModalProps): ReactElement => {
  const { getAccessTokenSilently } = useAuth0();

  const [open, setOpen] = useState(false);
  const handleOpen = (): void => {
    setOpen(true);
  };
  const handleClose = (): void => {
    setOpen(false);
  };

  const modalHeading = fileId ? "Edit File" : "Add File";

  // Context
  const fileTypes = useFileTypes();
  const books = useBooks();
  const otherBookId = useOtherBookId();

  // State and event handlers
  const [file, setFile] = useState<File | null>(null);
  const handleFileSelect: React.ChangeEventHandler = (e: React.ChangeEvent) => {
    setFile((e.target as HTMLFormElement).files[0]);
  };

  const [fileTypeId, setFileTypeId] = useState(fileTypes[0].id);
  useEffect(() => {
    setFileTypeId(fileTypes[0].id);
  }, [fileTypes]);

  const [bookId, setBookId] = useState(books[0].id);
  useEffect(() => {
    setBookId(books[0].id);
  }, [books]);
  const handleBookSelect = (bookId: number): void => {
    setBookId(bookId);
    if (bookId === otherBookId) {
      setHymnNum(null);
    }
  };

  const [hymnNum, setHymnNum] = useState<number | null>(null);
  const handleHymnNumberChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const re = /^[0-9\b]+$/;
    if (value === "" || re.test(value)) {
      setHymnNum(parseInt(value));
    }
  };

  const [comment, setComment] = useState("");
  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setComment(e.target.value);
  };

  // Get file data if this is an edit modal
  useEffect(() => {
    const getFile = async (): Promise<void> => {
      if (fileId) {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`/api/hymns/${hymnId}/files/${fileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const file = parseData(FileSchema, res.data, "Problem getting file");
        setFileTypeId(file.fileTypeId);
        setBookId(file.bookId);
        setHymnNum(file.hymnNum);
        setComment(file.comment);
      }
    };
    getFile().catch((e) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(`Get file failed:\n${msg}`);
    });
  }, []);

  // Form Validation
  const formErrors = useRef<string[]>([]);
  const formValid = (): boolean => {
    const errors: string[] = [];
    let formValid = true;

    if (fileId === null && file === null) {
      errors.push("File: No file selected");
      formValid = false;
    }

    if (fileTypeId > fileTypes.length) {
      errors.push("File Type: Invalid file type");
    }

    if (bookId > books.length) {
      errors.push("Book: Invalid book");
      formValid = false;
    }

    if (bookId !== otherBookId && hymnNum === null) {
      errors.push("Hymn Number: Hymn number cannot be blank");
      formValid = false;
    }

    formErrors.current = errors;
    return formValid;
  };

  // Form submit
  const handleAddFile: React.MouseEventHandler = (e: React.MouseEvent) => {
    const addFile = async (): Promise<void> => {
      if (formValid()) {
        const formData = new FormData();
        formData.append("file", file ?? "");
        formData.append("fileTypeId", fileTypeId.toString());
        formData.append("bookId", bookId.toString());
        formData.append("hymnNum", hymnNum === null ? "" : String(hymnNum));
        formData.append("comment", comment);
        const token = await getAccessTokenSilently();

        if (fileId) {
          const fileData: FileParams = {
            id: fileId,
            fileTypeId,
            bookId,
            hymnNum,
            comment,
          };
          await axios.put(`/api/hymns/${hymnId}/files/${fileId}`, fileData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          alert("File updated successfully");

          const res = await axios.get(`/api/hymns/${hymnId}/files`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const files = parseData(
            z.array(FileSchema),
            res.data,
            "Problem getting files",
          );
          setFiles(files);
          handleClose();
        } else {
          await axios.post(`/api/hymns/${hymnId}/files`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          alert("File uploaded successfully");

          const res = await axios.get(`/api/hymns/${hymnId}/files`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const files = parseData(
            z.array(FileSchema),
            res.data,
            "Problem getting files",
          );
          setFiles(files);
        }
      } else {
        let errorStr = "Error(s) in form submission:\n\n";
        for (const error of formErrors.current) {
          errorStr += `${error}\n`;
        }
        alert(errorStr);
      }
    };

    addFile().catch((e) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(`Get files failed:\n${msg}`);
    });
  };

  return (
    <>
      {fileId ? (
        <Tooltip title="Edit Hymn File Metadata">
          <IconButton aria-label="edit" sx={{ p: 0.7 }} onClick={handleOpen}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          variant="contained"
          color="warning"
          size="small"
          sx={{ width: { sm: "50%", xs: "100%" } }}
          onClick={handleOpen}
        >
          Add File
        </Button>
      )}

      {open && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"sm"}>
          <DialogTitle>{modalHeading}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ marginTop: "5px" }}>
              {fileId === null && (
                <Stack direction={"row"} spacing={2}>
                  <Button
                    variant="contained"
                    sx={{ width: "130px" }}
                    component={"label"}
                  >
                    Upload
                    <input
                      hidden
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileSelect}
                    />
                  </Button>
                  <TextField
                    fullWidth
                    size="small"
                    disabled
                    value={file?.name ?? ""}
                  />
                </Stack>
              )}

              <Dropdown
                label="File Type"
                options={fileTypes}
                value={fileTypeId}
                setValue={setFileTypeId}
              />
              <Dropdown
                label="Book"
                options={books}
                value={bookId}
                setValue={handleBookSelect}
              />

              {bookId !== otherBookId && (
                <TextField
                  fullWidth
                  size="small"
                  label="Hymn Num"
                  onChange={handleHymnNumberChange}
                  value={hymnNum ?? ""}
                />
              )}
              <TextField
                fullWidth
                size="small"
                label="Comment"
                onChange={handleCommentChange}
                value={comment}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClose}>
              Close
            </Button>
            <Button variant="contained" onClick={handleAddFile}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
