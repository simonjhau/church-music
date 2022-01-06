import { useAuth0 } from '@auth0/auth0-react';
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
import './HymnFileLink.css';

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
  const { getAccessTokenSilently } = useAuth0();
  const fileTypes = useFileTypes();
  const books = useBooks();
  const { editMode } = useEditMode();

  const handleFileClick: React.MouseEventHandler = async (
    e: React.MouseEvent
  ) => {
    const token = await getAccessTokenSilently();
    axios
      .get(
        `/hymns/${hymnId}/files/${(e.target as HTMLButtonElement).id}/file`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => window.open(res.data))
      .catch((e) => alert(`Failed to get music file:\n${e}`));
  };

  const handleDeleteFile = async (fileId: string) => {
    if (window.confirm(`Are you sure you want to delete`)) {
      const token = await getAccessTokenSilently();
      axios
        .delete(`/hymns/${hymnId}/files/${fileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => refreshHymnData(`/hymns/${hymnId}`))
        .catch((e) => alert(`Error deleting file:\n${e}`));
    }
  };

  return (
    <div key={file.id}>
      <Row sm="3">
        <Col>
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
          <Col>
            <div className="editButtons">
              <AddEditFileButtonModal
                modalType={ModalType.Edit}
                hymnId={hymnId}
                fileId={file.id}
                refreshHymnData={refreshHymnData}
              />

              <Button
                id={`${file.id}-del`}
                variant="danger"
                size="sm"
                onClick={(e) => handleDeleteFile(file.id)}
              >
                X
              </Button>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default HymnFileLink;
