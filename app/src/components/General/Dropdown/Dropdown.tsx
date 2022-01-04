import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { HymnTypesInterface } from '../../../context/TypesAndBooksContext';
import './Dropdown.css';

interface DropdownProps {
  text: string;
  options: HymnTypesInterface[];
  handleSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: number;
  size?: 'sm' | 'lg' | undefined;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  text,
  options,
  handleSelect,
  value,
  size,
  disabled = false,
}) => {
  return (
    <Form.Group as={Row} className="mb-1" controlId="formSelectFileType">
      <Form.Label column={size} sm="3">
        {text}:
      </Form.Label>
      <Col sm="9">
        <Form.Select
          aria-label={`Select ${text}`}
          className="dropdown"
          onChange={handleSelect}
          value={value}
          size={size}
          disabled={disabled}
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
