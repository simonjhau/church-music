import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Input from '../Input';

interface NewHymnModal {
  refreshHymnData: (endpoint: string) => void;
}

const NewHymnButtonModal: React.FC<NewHymnModal> = ({ refreshHymnData }) => {
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

    await axios
      .post('/hymns', hymnData)
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
          <Form>
            <Input label="Hymn Name" onChange={handleNameChange} value={name} />
          </Form>
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
