import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { MouseEvent, ReactElement } from "react";

interface EditBarProps {
  handleDuplicate: () => void;
  handleSaveChanges: () => void;
  handleDelete: () => void;
  handleCancelChanges: () => void;
}

const EditBar = ({
  handleDuplicate,
  handleSaveChanges,
  handleDelete,
  handleCancelChanges,
}: EditBarProps): ReactElement => {
  const handleDuplicateClick = (e: MouseEvent): void => {
    e.preventDefault();
    handleDuplicate();
  };

  const handleSaveChangesClick = (e: MouseEvent): void => {
    e.preventDefault();
    handleSaveChanges();
  };

  const handleDeleteChangesClick = (e: MouseEvent): void => {
    e.preventDefault();
    handleDelete();
  };

  const handleCancelChangesClick = (e: MouseEvent): void => {
    e.preventDefault();
    handleCancelChanges();
  };

  return (
    <Box sx={{ marginTop: 0 }}>
      <Tooltip title="Duplicate Mass">
        <IconButton
          aria-label="duplicate"
          sx={{ p: 0.7 }}
          onClick={handleDuplicateClick}
        >
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Save Mass">
        <IconButton
          aria-label="save"
          sx={{ p: 0.7 }}
          onClick={handleSaveChangesClick}
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete Mass">
        <IconButton
          aria-label="delete"
          sx={{ p: 0.7 }}
          onClick={handleDeleteChangesClick}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Revert Mass">
        <IconButton
          aria-label="cancel"
          sx={{ p: 0.7 }}
          onClick={handleCancelChangesClick}
        >
          <UndoIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default EditBar;
