import Form from 'react-bootstrap/Form';

const FileSelector = ({ handleFileSelect }) => {
  return (
    <Form.Group controlId="formFile" className="mb-3">
      <Form.Label>Choose PDF file to upload</Form.Label>
      <Form.Control type="file" onChange={handleFileSelect} />
    </Form.Group>
  );
};

export default FileSelector;
