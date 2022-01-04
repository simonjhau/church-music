import React from 'react';
import './CloseButton.css';

interface Props {
  onClick: (e: React.MouseEvent) => void;
}
const CloseButton: React.FC<Props> = ({ onClick }) => {
  return <button className="close-btn" onClick={onClick}></button>;
};

export default CloseButton;
