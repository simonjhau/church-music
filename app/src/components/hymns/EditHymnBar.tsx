import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";

interface EditBarProps {
  editMode: boolean;
  setEditMode: (em: boolean) => void;
  handleSaveChanges: () => void;
  handleDelete: () => void;
  handleCancelChanges: () => void;
}

export const EditHymnBar: React.FC<EditBarProps> = ({
  editMode,
  setEditMode,
  handleSaveChanges,
  handleDelete,
  handleCancelChanges,
}) => {
  const handleEditButtonClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    setEditMode(true);
  };

  const handleSaveChangesClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    setEditMode(false);
    handleSaveChanges();
  };

  const handleDeleteChangesClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    setEditMode(false);
    handleDelete();
  };

  const handleCancelChangesClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    setEditMode(false);
    handleCancelChanges();
  };

  return editMode ? (
    <Grid container spacing={2} sx={{ marginTop: 0 }}>
      <Grid item sm={9}>
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
      <Grid item sm={3}>
        <Button variant="outlined" fullWidth onClick={handleCancelChangesClick}>
          Cancel
        </Button>
      </Grid>
    </Grid>
  ) : (
    <Grid container spacing={2} sx={{ marginTop: 0 }}>
      <Grid item sm={9}></Grid>
      <Grid item sm={3}>
        <Button variant="outlined" fullWidth onClick={handleEditButtonClick}>
          Edit
        </Button>
      </Grid>
    </Grid>
  );
};
