import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useEditMode } from '../../context/EditModeContext';

interface EditBarProps {
  itemSelected: boolean;
  handleSaveChanges: () => void;
  handleCancelChanges: () => void;
}

const EditBar: React.FC<EditBarProps> = ({
  itemSelected,
  handleSaveChanges,
  handleCancelChanges,
}) => {
  const { editMode, setEditMode } = useEditMode();

  enum ButtonConfigs {
    New,
    Edit,
    SaveCancel,
  }
  const [buttonConfig, setButtonConfig] = useState<ButtonConfigs>(
    ButtonConfigs.New
  );

  // Work out button configuration
  useEffect(() => {
    if (!itemSelected) {
      setButtonConfig(ButtonConfigs.New);
    } else if (itemSelected && !editMode) {
      setButtonConfig(ButtonConfigs.Edit);
    } else {
      setButtonConfig(ButtonConfigs.SaveCancel);
    }
    // eslint-disable-next-line
  }, [itemSelected, editMode]);

  const handleEditButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditMode(!editMode);
  };

  const handleSaveChangesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditMode(!editMode);
  };

  const handleCancelChangesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleCancelChanges();
  };

  switch (buttonConfig) {
    case ButtonConfigs.New:
      return (
        <Col className="d-grid" sm={{ offset: 9, span: 3 }}>
          <Button type="submit" onClick={handleEditButtonClick}>
            New Hymn
          </Button>
        </Col>
      );

    case ButtonConfigs.Edit:
      return (
        <Col className="d-grid" sm={{ offset: 9, span: 3 }}>
          <Button type="submit" onClick={handleEditButtonClick}>
            Edit
          </Button>
        </Col>
      );

    case ButtonConfigs.SaveCancel:
      return (
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextComment">
          <Col className="d-grid" sm={{ offset: 6, span: 3 }}>
            <Button type="submit" onClick={handleEditButtonClick}>
              Save
            </Button>
          </Col>
          <Col className="d-grid">
            <Button type="submit" onClick={handleCancelChangesClick}>
              Cancel
            </Button>
          </Col>
        </Form.Group>
      );
  }
};

export default EditBar;
