import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import { MouseEvent, ReactElement } from "react";

interface EditBarProps {
  editMode: boolean;
  setEditMode: (em: boolean) => void;
  handleSaveChanges: () => void;
  handleDelete: () => void;
  handleCancelChanges: () => void;
}

export const EditHymnBar = ({
  editMode,
  setEditMode,
  handleSaveChanges,
  handleDelete,
  handleCancelChanges,
}: EditBarProps): ReactElement => {
  const handleEditButtonClick = (e: MouseEvent): void => {
    e.preventDefault();
    setEditMode(true);
  };

  const handleSaveChangesClick = (e: MouseEvent): void => {
    e.preventDefault();
    setEditMode(false);
    handleSaveChanges();
  };

  const handleDeleteChangesClick = (e: MouseEvent): void => {
    e.preventDefault();
    setEditMode(false);
    handleDelete();
  };

  const handleCancelChangesClick = (e: MouseEvent): void => {
    e.preventDefault();
    setEditMode(false);
    handleCancelChanges();
  };

  return editMode ? (
    <Grid container spacing={2} sx={{ marginTop: 0 }}>
      <Grid size={9}>
        <Tooltip title="Save Hymn">
          <IconButton
            aria-label="save"
            sx={{ p: 0.7 }}
            onClick={handleSaveChangesClick}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Hymn">
          <IconButton
            aria-label="delete"
            sx={{ p: 0.7 }}
            onClick={handleDeleteChangesClick}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid size={3}>
        <Button variant="outlined" fullWidth onClick={handleCancelChangesClick}>
          Cancel
        </Button>
      </Grid>
    </Grid>
  ) : (
    <Grid container spacing={2} sx={{ marginTop: 0 }}>
      <Grid size={9}></Grid>
      <Grid size={3}>
        <Button variant="outlined" fullWidth onClick={handleEditButtonClick}>
          Edit
        </Button>
      </Grid>
    </Grid>
  );
};
