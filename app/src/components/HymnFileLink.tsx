import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useEditMode } from '../context/EditModeContext';
import { useBooks, useFileTypes } from '../context/TypesAndBooksContext';
import { FileInterface } from '../interfaces/interfaces';

interface HymnFileLinkProps {
  file: FileInterface;
  handleDeleteFile: (deletedFileId: string) => void;
}

const HymnFileLink: React.FC<HymnFileLinkProps> = ({
  file,
  handleDeleteFile,
}) => {
  const fileTypes = useFileTypes();
  const books = useBooks();
  const { editMode } = useEditMode();

  const handleFileClick: React.MouseEventHandler = (e: React.MouseEvent) => {
    window.open(
      `${process.env.REACT_APP_API_URL}/files/${
        (e.target as HTMLButtonElement).id
      }`
    );
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
            {books.find((book) => book.id === file.bookId)?.name}
            {file.hymnNum ? ` - ${file.hymnNum}` : ''}
            {file.comment ? ` - ${file.comment}` : ''}
          </Button>
        </Col>
        <Col>
          {editMode && (
            <Button
              id={`${file.id}-del`}
              variant="danger"
              size="sm"
              onClick={(e) => handleDeleteFile(file.id)}
            >
              X
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default HymnFileLink;
