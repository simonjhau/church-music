import { useAuth0 } from "@auth0/auth0-react";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import {
  useBooks,
  useFileTypes,
  useOtherBookId,
} from "../../context/TypesAndBooksContext";
import { FileSchema, type Hymn } from "../../types";
import { parseData } from "../../utils";
import { Dropdown } from "../general/HymnTypesDropdown";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface FileData {
  id: string;
  hymnId: string;
  fileTypeId: number;
  bookId: number;
  hymnNum: number;
  comment: string;
}

interface AddEditFileModalProps {
  hymnId: string;
  fileId?: string;
  setHymnData: (hymn: Hymn | null) => void;
}

export const AddEditFileButtonModal: React.FC<AddEditFileModalProps> = ({
  hymnId,
  fileId,
  setHymnData,
}) => {
  const { getAccessTokenSilently } = useAuth0();

  const [show, setShow] = useState(false);
  const handleShow = (): void => {
    setShow(true);
  };
  const handleClose = (): void => {
    setShow(false);
  };

  const buttonText = fileId ? "Edit" : "Add File";

  // Context
  const fileTypes = useFileTypes();
  const books = useBooks();
  const otherBookId = useOtherBookId();

  // State and event handlers
  const [file, setFile] = useState("");
  // const handleFileSelect: React.ChangeEventHandler = (e: React.ChangeEvent) => {
  //   setFile((e.target as HTMLFormElement).files[0]);
  // };

  const [fileTypeId, setFileTypeId] = useState(fileTypes[0].id);
  useEffect(() => {
    setFileTypeId(fileTypes[0].id);
  }, [fileTypes]);
  // const handleFileTypeSelect: React.ChangeEventHandler = (
  //   e: React.ChangeEvent
  // ) => {
  //   setFileTypeId(parseInt((e.target as HTMLSelectElement).value));
  // };

  const [bookId, setBookId] = useState(books[0].id);
  useEffect(() => {
    setBookId(books[0].id);
  }, [books]);
  // const handleBookSelect: React.ChangeEventHandler = (e: React.ChangeEvent) => {
  //   const bookId = parseInt((e.target as HTMLSelectElement).value);
  //   setBookId(bookId);
  //   if (bookId === otherBookId) {
  //     setHymnNum("");
  //   }
  // };

  const [hymnNum, setHymnNum] = useState<number | null>(null);
  // const handleHymnNumberChange: React.ChangeEventHandler = (
  //   e: React.ChangeEvent
  // ) => {
  //   const value = (e.target as HTMLSelectElement).value;
  //   const re = /^[0-9\b]+$/;
  //   if (value === "" || re.test(value)) {
  //     setHymnNum(value);
  //   }
  // };

  const [comment, setComment] = useState("");
  // const handleCommentChange: React.ChangeEventHandler = (
  //   e: React.ChangeEvent
  // ) => {
  //   setComment((e.target as HTMLSelectElement).value);
  // };

  // Get file data if this is an edit modal
  // useEffect(() => {
  //   const getFile = async (): Promise<void> => {
  //     if (fileId) {
  //       const token = await getAccessTokenSilently();
  //       const res = await axios.get(`api/hymns/${hymnId}/files/${fileId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const file = parseData(FileSchema, res.data, "Problem getting file");
  //       setFileTypeId(file.fileTypeId);
  //       setBookId(file.bookId);
  //       setHymnNum(file.hymnNum);
  //       setComment(file.comment);
  //     }
  //   };
  //   getFile().catch((e) => {
  //     const msg = e instanceof Error ? e.message : "Unknown error";
  //     alert(`Get files failed:\n${msg}`);
  //   });
  // }, []);

  // // Form Validation
  // const formErrors = useRef<string[]>([]);
  // const formValid = (): boolean => {
  //   const errors: string[] = [];
  //   let formValid = true;

  //   if (modalType === ModalType.Add && file == null) {
  //     errors.push("File: No file selected");
  //     formValid = false;
  //   }

  //   if (fileTypeId > fileTypes.length) {
  //     errors.push("File Type: Invalid file type");
  //   }

  //   if (bookId > books.length) {
  //     errors.push("Book: Invalid book");
  //     formValid = false;
  //   }

  //   if (bookId !== otherBookId && hymnNum === "") {
  //     errors.push("Hymn Number: Hymn number cannot be blank");
  //     formValid = false;
  //   }

  //   formErrors.current = errors;
  //   return formValid;
  // };

  // Form submit
  // const handleAddFile: React.MouseEventHandler = (e: React.MouseEvent) => {
  //   const addFile = async (): Promise<void> => {
  //     if (formValid()) {
  //       const formData = new FormData();
  //       formData.append("file", file);
  //       formData.append("hymnId", hymnId);
  //       formData.append("fileTypeId", fileTypeId.toString());
  //       formData.append("bookId", bookId.toString());
  //       formData.append("hymnNum", hymnNum);
  //       formData.append("comment", comment);

  //       const token = await getAccessTokenSilently();

  //       if (fileId) {
  //         const fileData = {
  //           fileTypeId,
  //           bookId,
  //           hymnNum,
  //           comment,
  //         };
  //         const res = await axios.put(
  //           `api/hymns/${hymnId}/files/${fileId}`,
  //           fileData,
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );

  //         alert("File updated successfully");
  //         // To do: fix this
  //         // refreshHymnData(`/hymns/${hymnId}`);
  //         handleClose();
  //       } else {
  //         const res = await axios.post(`api/hymns/${hymnId}/files`, formData, {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });

  //         alert("File uploaded successfully");
  //         // To do: fix this
  //         // refreshHymnData(`/hymns/${hymnId}`);
  //       }
  //     } else {
  //       let errorStr = "Error(s) in form submission:\n\n";
  //       for (const error of formErrors.current) {
  //         errorStr += `${error}\n`;
  //       }
  //       alert(errorStr);
  //     }
  //   };

  //   addFile().catch((e) => {
  //     const msg = e instanceof Error ? e.message : "Unknown error";
  //     alert(`Get files failed:\n${msg}`);
  //   });
  // };

  return (
    <>
      <IconButton aria-label="edit" sx={{ p: 0.7 }} onClick={handleShow}>
        <EditIcon />
      </IconButton>

      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {modalType === ModalType.Add && (
              <Button variant="contained" component="label">
                Upload
                <input hidden type="file" onChange={handleFileSelect} />
              </Button>
            )}

            <Dropdown
              text="File Type"
              options={fileTypes}
              handleSelect={handleFileTypeSelect}
              value={fileTypeId}
            />
            <Dropdown
              text="Book"
              options={books}
              handleSelect={handleBookSelect}
              value={bookId}
            />
            {bookId !== otherBookId && (
              <TextField
                label="Hymn Num"
                onChange={handleHymnNumberChange}
                value={hymnNum}
              />
            )}
            <TextField
              label="Comment"
              onChange={handleCommentChange}
              value={comment}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" onClick={handleAddFile}>
            Save File
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};
