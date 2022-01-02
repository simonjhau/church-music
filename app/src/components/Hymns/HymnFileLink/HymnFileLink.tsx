import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useEditMode } from '../../../context/EditModeContext';
import { useBooks, useFileTypes } from '../../../context/TypesAndBooksContext';
import { FileInterface } from '../../../interfaces/interfaces';
import AddEditFileButtonModal, {
  ModalType,
} from '../AddEditFileButtonModal/AddEditFileButtonModal';

interface HymnFileLinkProps {
  hymnId: string;
  file: FileInterface;
  refreshHymnData: (endpoint: string) => void;
}

const HymnFileLink: React.FC<HymnFileLinkProps> = ({
  hymnId,
  file,
  refreshHymnData,
}) => {
  const fileTypes = useFileTypes();
  const books = useBooks();
  const { editMode } = useEditMode();

  const handleFileClick: React.MouseEventHandler = (e: React.MouseEvent) => {
    window.open(
      `${process.env.REACT_APP_API_URL}/hymns/${hymnId}/files/${
        (e.target as HTMLButtonElement).id
      }/file`
    );
  };

  const handleDeleteFile = (fileId: string) => {
    axios
      .delete(`/hymns/${hymnId}/files/${fileId}`)
      .then((res) => refreshHymnData(`/hymns/${hymnId}`))
      .catch((e) => alert(`Error deleting file:\n${e}`));
  };

  return (
    <div key={file.id}>
      <Row>
        <Col sm="5">
          <Button variant="link" id={file.id} onClick={handleFileClick}>
            {
              fileTypes.find((fileType) => fileType.id === file.fileTypeId)
                ?.name
            }
            {' - '}
            {books.find((book) => book.id === file.bookId)?.bookCode}
            {file.hymnNum ? ` - ${file.hymnNum}` : ''}
            {file.comment ? ` - ${file.comment}` : ''}
          </Button>
        </Col>
        {editMode && (
          <Col sm="1">
            <AddEditFileButtonModal
              modalType={ModalType.Edit}
              hymnId={hymnId}
              fileId={file.id}
              refreshHymnData={refreshHymnData}
            />
          </Col>
        )}
        {editMode && (
          <Col>
            <Button
              id={`${file.id}-del`}
              variant="danger"
              size="sm"
              onClick={(e) => handleDeleteFile(file.id)}
            >
              X
            </Button>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default HymnFileLink;
