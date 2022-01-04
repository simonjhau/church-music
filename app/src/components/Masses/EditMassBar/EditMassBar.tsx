import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import './EditMassBar.css';

interface EditBarProps {
  handleDuplicate: () => void;
  handleSaveChanges: () => void;
  handleDelete: () => void;
  handleCancelChanges: () => void;
}

const EditBar: React.FC<EditBarProps> = ({
  handleDuplicate,
  handleSaveChanges,
  handleDelete,
  handleCancelChanges,
}) => {
  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDuplicate();
  };

  const handleSaveChangesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSaveChanges();
  };

  const handleDeleteChangesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDelete();
  };

  const handleCancelChangesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleCancelChanges();
  };

  return (
    <Form.Group className="editBar" as={Row} controlId="formPlaintextComment">
      <Col className="d-grid" sm={{ span: 3 }}>
        <Button
          size="sm"
          variant="secondary"
          type="submit"
          onClick={handleDuplicateClick}
        >
          Duplicate
        </Button>
      </Col>
      <Col className="d-grid">
        <Button
          size="sm"
          variant="primary"
          type="submit"
          onClick={handleSaveChangesClick}
        >
          Save
        </Button>
      </Col>
      <Col className="d-grid">
        <Button
          size="sm"
          variant="danger"
          type="submit"
          onClick={handleDeleteChangesClick}
        >
          Delete
        </Button>
      </Col>
      <Col className="d-grid">
        <Button
          size="sm"
          variant="outline-primary"
          type="submit"
          onClick={handleCancelChangesClick}
        >
          Cancel
        </Button>
      </Col>
    </Form.Group>
  );
};

export default EditBar;
