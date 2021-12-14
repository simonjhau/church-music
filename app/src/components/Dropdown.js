import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Dropdown = ({ text, options, handleSelect, value }) => {
  return (
    <Form.Group as={Row} className="mb-3" controlId="formSelectFileType">
      <Form.Label column sm="3">
        {text}:
      </Form.Label>
      <Col sm="9">
        <Form.Select
          aria-label={`Select ${text}`}
          name="fileType"
          onChange={handleSelect}
          value={value}
        >
          {options.map((option) => {
            return (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            );
          })}
        </Form.Select>
      </Col>
    </Form.Group>
  );
};

export default Dropdown;
