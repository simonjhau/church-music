import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Input from '../../General/Input/Input';

interface NewHymnModal {
  refreshHymnData: (endpoint: string) => void;
}

const NewHymnButtonModal: React.FC<NewHymnModal> = ({ refreshHymnData }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [name, setName] = useState('');
  const handleNameChange = (e: React.ChangeEvent) => {
    setName((e.target as HTMLInputElement).value);
  };

  const handleSaveHymn = async () => {
    if (!name) {
      alert('Error: Name cannot be blank');
    }

    const hymnData = {
      name: name,
    };

    const token = getAccessTokenSilently();
    axios
      .post('/hymns', hymnData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        alert('Mass saved successfully');
        setName('');
        handleClose();
        refreshHymnData(res.headers.location);
      })
      .catch((e) => {
        alert(`Error saving mass:\n${e.response.status}: ${e.response.data}`);
      });
  };

  return (
    <>
      <Button type="submit" variant="outline-primary" onClick={handleShow}>
        New Hymn
      </Button>

      <Modal show={show} onHide={handleClose}>
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
      </Modal>
    </>
  );
};

export default NewHymnButtonModal;
