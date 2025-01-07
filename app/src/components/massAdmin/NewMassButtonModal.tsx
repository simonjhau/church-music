import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { type ReactNode, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MassSchema } from "../../types";
import { parseData } from "../../utils";

interface NewMassModalProps {
  initialMassName: string;
}

export const NewMassButtonModal = ({
  initialMassName,
}: NewMassModalProps): ReactNode => {
  const { getAccessTokenSilently } = useAuth0();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = (): void => {
    setOpen(true);
  };
  const handleClose = (): void => {
    setOpen(false);
  };

  const name = useRef(initialMassName);
  const handleNameChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    name.current = e.target.value;
  };

  const handleSaveMass = (): void => {
    if (!name) {
      alert("Error: Name cannot be blank");
      return;
    }

    const massData = {
      name: name.current,
      dateTime: new Date(),
    };

    const addMass = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      const res = await axios.post("/api/masses", massData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mass = parseData(MassSchema, res.data, "Problem adding new mass");
      alert("Mass saved successfully");
      name.current = "";
      handleClose();
      navigate(`/massAdmin/${mass.id}`);
    };

    addMass().catch((e) => {
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
        Create new mass
      </Button>

      {open && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"sm"}>
          <DialogTitle>Create new mass</DialogTitle>
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
            <Button variant="contained" onClick={handleSaveMass}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
