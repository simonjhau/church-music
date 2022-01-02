import React from 'react';
import Form from 'react-bootstrap/Form';

interface Props {
  handleFileSelect: React.ChangeEventHandler;
}

const FileSelector: React.FC<Props> = ({ handleFileSelect }) => {
  return (
    <Form.Group controlId="formFile" className="mb-3">
      <Form.Label>Choose PDF file to upload</Form.Label>
      <Form.Control type="file" onChange={handleFileSelect} />
    </Form.Group>
  );
};

export default FileSelector;
