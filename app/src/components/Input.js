import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Dropdown = ({ label, onChange, value }) => {
  return (
    <Form.Group as={Row} className="mb-3" controlId="formPlaintextComment">
      <Form.Label column sm="3">
        {label}:
      </Form.Label>
      <Col sm="9">
        <Form.Control value={value} onChange={onChange} placeholder={label} />
      </Col>
    </Form.Group>
  );
};

export default Dropdown;
