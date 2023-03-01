import { useAuth0 } from "@auth0/auth0-react";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useRef, useState } from "react";

import { type Hymn, HymnSchema } from "../../types";
import { parseData } from "../../utils";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
      const res = await axios.post("api/hymns", hymnData, {
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
        New Hymn
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid container sx={style} rowSpacing={2} columnSpacing={1}>
          <Grid item xs={12}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              New Hymn
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Name"
              variant="outlined"
              onChange={handleNameChange}
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={handleClose}
            >
              Close
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button fullWidth variant="contained" onClick={handleSaveHymn}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
