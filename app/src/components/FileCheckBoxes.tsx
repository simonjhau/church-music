import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useBooks, useFileTypes } from '../context/TypesAndBooksContext';
import { FileInterface } from '../interfaces/interfaces';

interface Props {
  label: string;
  files: FileInterface[];
  onChange: (fileIndex: number) => void;
}

const FileCheckBoxes: React.FC<Props> = ({ label, files, onChange }) => {
  const books = useBooks();
  const fileTypes = useFileTypes();

  return (
    <Form.Group as={Row} className="mb-3" controlId="formPlaintextHymnName">
      <Form.Label column sm="3">
        {label}:
      </Form.Label>
      {files.length > 0 && (
        <Col sm="9">
          {files.map((file, fileIndex) => {
            return (
              <Form.Check
                type="checkbox"
                id={file.id}
                key={file.id}
                label={`
                          ${
                            fileTypes.find(
                              (fileType) => fileType.id === file.fileTypeId
                            )?.name
                          } - ${
                  books.find((book) => book.id === file.bookId)?.name
                } ${file.hymnNum ? ` - ${file.hymnNum}` : ''} ${
                  file.comment ? ` - ${file.comment}` : ''
                }`}
                checked={files[fileIndex].selected}
                onChange={(e) => onChange(fileIndex)}
              />
            );
          })}
        </Col>
      )}
    </Form.Group>
  );
};

export default FileCheckBoxes;
