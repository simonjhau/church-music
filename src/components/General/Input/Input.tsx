import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

interface InputProps {
  label: string;
  onChange: React.ChangeEventHandler;
  value: string;
}

const Input: React.FC<InputProps> = ({ label, onChange, value }) => {
  const handleChange = (e: React.ChangeEvent) => {
    e.preventDefault();
    onChange(e);
  };
  return (
    <Form.Group as={Row} className="mb-2" controlId="formPlaintextComment">
      <Form.Label column sm="3">
        {label}:
      </Form.Label>
      <Col sm="9">
        <Form.Control
          value={value}
          onChange={handleChange}
          placeholder={label}
        />
      </Col>
    </Form.Group>
  );
};

export default Input;
