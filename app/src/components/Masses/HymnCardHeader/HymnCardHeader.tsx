import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import './HymnCardHeader.css';

interface Props {
  hymnIndex: number;
  handleDelete: (e: React.MouseEvent) => void;
}

const HymnCardHeader: React.FC<Props> = ({ hymnIndex, handleDelete }) => {
  return (
    <Row className="mb-2 justify-content-md-center">
      <Col sm={1}>
        <Form.Label column="sm" className="hymnCardIndex">
          {hymnIndex + 1}
        </Form.Label>
      </Col>
      <Col sm={10} />
      <Col sm={1}>
        <div className="deleteBtn">
          <Button size="sm" variant="danger" onClick={handleDelete}>
            X
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default HymnCardHeader;
