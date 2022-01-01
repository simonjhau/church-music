import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useEditMode } from '../../context/EditModeContext';
import './EditBar.css';

interface EditBarProps {
  handleSaveChanges: () => void;
  handleDelete: () => void;
  handleCancelChanges: () => void;
}

const EditBar: React.FC<EditBarProps> = ({
  handleSaveChanges,
  handleDelete,
  handleCancelChanges,
}) => {
  const { editMode, setEditMode } = useEditMode();

  const handleEditButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditMode(true);
  };

  const handleSaveChangesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditMode(false);
    handleSaveChanges();
  };

  const handleDeleteChangesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditMode(false);
    handleDelete();
  };

  const handleCancelChangesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditMode(false);
    handleCancelChanges();
  };

  return editMode ? (
    <Form.Group className="editBar" as={Row} controlId="formPlaintextComment">
      <Col className="d-grid" sm={{ offset: 3, span: 3 }}>
        <Button
          variant="primary"
          type="submit"
          onClick={handleSaveChangesClick}
        >
          Save
        </Button>
      </Col>
      <Col className="d-grid">
        <Button
          variant="danger"
          type="submit"
          onClick={handleDeleteChangesClick}
        >
          Delete
        </Button>
      </Col>
      <Col className="d-grid">
        <Button
          variant="outline-primary"
          type="submit"
          onClick={handleCancelChangesClick}
        >
          Cancel
        </Button>
      </Col>
    </Form.Group>
  ) : (
    <div className="editBar">
      <Row>
        <Col className="d-grid" sm={9}></Col>
        <Col className="d-grid" sm={3}>
          <Button
            variant="outline-primary"
            type="submit"
            onClick={handleEditButtonClick}
          >
            Edit
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default EditBar;
