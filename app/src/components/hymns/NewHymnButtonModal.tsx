import { useAuth0 } from "@auth0/auth0-react";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { useRef, useState } from "react";

import { type Hymn, HymnSchema } from "../../types";
import { parseData } from "../../utils";

interface NewHymnModalProps {
  initialHymnName: string;
  setHymnData: (hymn: Hymn | null) => void;
}

export const NewHymnButtonModal: React.FC<NewHymnModalProps> = ({
  initialHymnName,
  setHymnData,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [open, setOpen] = useState(false);
  const handleOpen = (): void => {
    setOpen(true);
  };
  const handleClose = (): void => {
    setOpen(false);
  };

  const name = useRef(initialHymnName);
  const handleNameChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    name.current = e.target.value;
  };

  const handleSaveHymn = (): void => {
    if (!name) {
      alert("Error: Name cannot be blank");
      return;
    }

    const hymnData = {
      name: name.current,
    };

    const addHymn = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      const res = await axios.post("/api/hymns", hymnData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const hymn = parseData(HymnSchema, res.data, "Problem adding new hymn");
      alert("Mass saved successfully");
      name.current = "";
      handleClose();
      setHymnData(hymn);
    };

    addHymn().catch((e) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(`Error saving mass:\n${msg}`);
    });
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        fullWidth
        sx={{ whiteSpace: "nowrap", minWidth: "max-content" }}
      >
        Add new hymn
      </Button>
      {open && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"sm"}>
          <DialogTitle>Add new hymn</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              size="small"
              label="Name"
              variant="outlined"
              onChange={handleNameChange}
              sx={{ marginTop: "4px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClose}>
              Close
            </Button>
            <Button variant="contained" onClick={handleSaveHymn}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
