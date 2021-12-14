import Button from 'react-bootstrap/Button';
import DraggableHymnsList from './DraggableHymnsList';

const MassHymnChooser = ({ hymnsData, setHymnsData }) => {
  const handleAddHymn = (e) => {
    e.preventDefault();
    setHymnsData([
      ...hymnsData,
      {
        id: ``,
        name: '',
        hymnTypeId: 0,
        fileIds: [],
      },
    ]);
  };

  return (
    <>
      <DraggableHymnsList hymnsData={hymnsData} setHymnsData={setHymnsData} />
      <Button variant="outline-primary" onClick={handleAddHymn}>
        +
      </Button>{' '}
    </>
  );
};

export default MassHymnChooser;
