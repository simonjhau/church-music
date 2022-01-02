import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {
  useBooks,
  useFileTypes,
  useOtherBookId,
} from '../../context/TypesAndBooksContext';
import Dropdown from '../Dropdown/Dropdown';
import FileSelector from '../FileSelector';
import Input from '../Input';

export enum ModalType {
  Add,
  Edit,
}

interface FileData {
  id: string;
  hymnId: string;
  fileTypeId: number;
  bookId: number;
  hymnNum: number;
  comment: string;
}

interface AddEditFileModalProps {
  modalType: ModalType;
  hymnId: string;
  fileId?: string;
  refreshHymnData: (endpoint: string) => void;
}

const AddEditFileButtonModal: React.FC<AddEditFileModalProps> = ({
  modalType,
  hymnId,
  fileId,
  refreshHymnData,
}) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const buttonText = modalType === ModalType.Add ? 'Add File' : 'Edit';

  // Context
  const fileTypes = useFileTypes();
  const books = useBooks();
  const otherBookId = useOtherBookId();

  // State and event handlers
  const [file, setFile] = useState('');
  const handleFileSelect: React.ChangeEventHandler = (e: React.ChangeEvent) => {
    setFile((e.target as HTMLFormElement).files[0]);
  };

  const [fileTypeId, setFileTypeId] = useState(fileTypes[0].id);
  useEffect(() => {
    setFileTypeId(fileTypes[0].id);
  }, [fileTypes]);
  const handleFileTypeSelect: React.ChangeEventHandler = (
    e: React.ChangeEvent
  ) => {
    setFileTypeId(parseInt((e.target as HTMLSelectElement).value));
  };

  const [bookId, setBookId] = useState(books[0].id);
  useEffect(() => {
    setBookId(books[0].id);
  }, [books]);
  const handleBookSelect: React.ChangeEventHandler = (e: React.ChangeEvent) => {
    const bookId = parseInt((e.target as HTMLSelectElement).value);
    setBookId(bookId);
    if (bookId === otherBookId) {
      setHymnNum('');
    }
  };

  const [hymnNum, setHymnNum] = useState('');
  const handleHymnNumberChange: React.ChangeEventHandler = (
    e: React.ChangeEvent
  ) => {
    const value = (e.target as HTMLSelectElement).value;
    const re = /^[0-9\b]+$/;
    if (value === '' || re.test(value)) {
      setHymnNum(value);
    }
  };

  const [comment, setComment] = useState('');
  const handleCommentChange: React.ChangeEventHandler = (
    e: React.ChangeEvent
  ) => {
    setComment((e.target as HTMLSelectElement).value);
  };

  // Get file data if this is an edit modal
  useEffect(() => {
    if (modalType === ModalType.Edit) {
      axios
        .get(`/hymns/${hymnId}/files/${fileId}`)
        .then((res) => {
          const fileData = res.data[0] as FileData;
          setFileTypeId(fileData.fileTypeId);
          setBookId(fileData.bookId);
          setHymnNum(fileData.hymnNum?.toString());
          setComment(fileData.comment);
        })
        .catch((e) => console.error(`Get files failed:\n${e}`));
    }
    // Get list of files for this hymns

    //eslint-disable-next-line
  }, []);

  // Form Validation
  const formErrors = useRef<string[]>([]);
  const formValid = () => {
    const errors: string[] = [];
    let formValid = true;

    if (modalType === ModalType.Add && file == null) {
      errors.push('File: No file selected');
      formValid = false;
    }

    if (fileTypeId > fileTypes.length) {
      errors.push('File Type: Invalid file type');
    }

    if (bookId > books.length) {
      errors.push('Book: Invalid book');
      formValid = false;
    }

    if (bookId !== otherBookId && hymnNum === '') {
      errors.push('Hymn Number: Hymn number cannot be blank');
      formValid = false;
    }

    formErrors.current = errors;
    return formValid;
  };

  // Form submit
  const handleAddFile: React.MouseEventHandler = async (
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    if (formValid()) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('hymnId', hymnId);
      formData.append('fileTypeId', fileTypeId.toString());
      formData.append('bookId', bookId.toString());
      formData.append('hymnNum', hymnNum);
      formData.append('comment', comment);

      if (modalType === ModalType.Add) {
        await axios
          .post(`/hymns/${hymnId}/files`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then((res) => {
            alert('File uploaded successfully');
            refreshHymnData(`/hymns/${hymnId}`);
          })
          .catch((e) => {
            alert(
              `Error uploading file:\n${e.response.status}: ${e.response.data}`
            );
          });
      } else {
        const fileData = {
          fileTypeId: fileTypeId,
          bookId: bookId,
          hymnNum: hymnNum,
          comment: comment,
        };
        await axios
          .put(`/hymns/${hymnId}/files/${fileId}`, fileData)
          .then((res) => {
            alert('File updated successfully');
            refreshHymnData(`/hymns/${hymnId}`);
            handleClose();
          })
          .catch((e) => {
            alert(
              `Error uploading file:\n${e.response.status}: ${e.response.data}`
            );
          });
      }
    } else {
      let errorStr = 'Error(s) in form submission:\n\n';
      for (const error of formErrors.current) {
        errorStr += `${error}\n`;
      }
      alert(errorStr);
    }
  };

  return (
    <>
      <Button type="submit" size="sm" variant="warning" onClick={handleShow}>
        {buttonText}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {modalType === ModalType.Add && (
              <FileSelector handleFileSelect={handleFileSelect} />
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
              <Input
                label="Hymn Num"
                onChange={handleHymnNumberChange}
                value={hymnNum}
              />
            )}
            <Input
              label="Comment"
              onChange={handleCommentChange}
              value={comment}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddFile}>
            Save File
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditFileButtonModal;
