import React from 'react';
import Button from 'react-bootstrap/Button';
import './MassCard.css';

export interface MassInterface {
  id: string;
  name: string;
  dateTime: string;
  fileId: string;
}

interface Props {
  mass: MassInterface;
}

const dateTimeToString = (dateTimeSql: string) => {
  const dateTime = new Date(dateTimeSql);
  const dateTimeString = dateTime.toUTCString();
  return dateTimeString.substring(0, dateTimeString.length - 7);
};

const MassCard: React.FC<Props> = ({ mass }) => {
  const dateTime = dateTimeToString(mass.dateTime);

  const handleMassFileClick: React.MouseEventHandler = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    window.open(`${process.env.REACT_APP_API_URL}/masses/${mass.id}/file`);
  };

  return (
    <div className="massCard">
      <h1>{dateTime}</h1>
      <h2>{mass.name}</h2>
      <br />
      <div className="d-grid gap-2">
        <Button variant="primary" size="lg" onClick={handleMassFileClick}>
          Get Music
        </Button>
      </div>
    </div>
  );
};

export default MassCard;
