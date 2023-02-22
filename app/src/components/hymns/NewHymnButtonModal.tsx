import { useAuth0 } from "@auth0/auth0-react";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useRef, useState } from "react";

interface NewHymnModalProps {
  initialHymnName: string;
  refreshHymnData: (endpoint: string) => void;
}

const NewHymnButtonModal: React.FC<NewHymnModalProps> = ({
  initialHymnName,
  refreshHymnData,
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

  const handleSaveHymn = async () => {
    if (!name) {
      alert("Error: Name cannot be blank");
    }

    const hymnData = {
      name,
    };

    const token = await getAccessTokenSilently();
    axios
      .post("/hymns", hymnData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        alert("Mass saved successfully");
        name.current = "";
        handleClose();
        refreshHymnData(res.headers.location);
      })
      .catch((e) => {
        const msg = e instanceof Error ? "e.message" : "Unknown error";
        alert(`Error saving mass:\n${msg}`);
      });
  };

  return (
    <>
      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Hymn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input label="Hymn Name" onChange={handleNameChange} value={name} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveHymn}>
            Save Hymn
          </Button>
        </Modal.Footer>
      </Modal> */}

      <Button
        onClick={handleOpen}
        variant="contained"
        fullWidth
        // sx={{ height: "100", minHeight: "30px" }}
      >
        New Hymn
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New Hymn
          </Typography>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            onChange={handleNameChange}
          />
        </Box>
      </Modal>
    </>
  );
};

export default NewHymnButtonModal;
