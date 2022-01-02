import axios from 'axios';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Input from '../../General/Input/Input';

interface NewMassModal {
  refreshMassData: (endpoint: string) => void;
}

const NewMassButtonModal: React.FC<NewMassModal> = ({ refreshMassData }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [name, setName] = useState('');
  const handleNameChange = (e: React.ChangeEvent) => {
    setName((e.target as HTMLInputElement).value);
  };

  const handleSaveMass = async () => {
    if (!name) {
      alert('Error: Name cannot be blank');
    }

    const massData = {
      name: name,
      dateTime: new Date().toISOString(),
    };

    await axios
      .post('/masses', massData)
      .then((res) => {
        alert('Mass added successfully');
        setName('');
        handleClose();
        refreshMassData(res.headers.location);
      })
      .catch((e) => {
        alert(`Error saving mass:\n${e.response.status}: ${e.response.data}`);
      });
  };

  return (
    <>
      <Button type="submit" variant="outline-primary" onClick={handleShow}>
        New Mass
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Mass</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Input label="Mass Name" onChange={handleNameChange} value={name} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveMass}>
            Save Mass
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NewMassButtonModal;
