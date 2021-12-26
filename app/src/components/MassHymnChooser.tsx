import Button from 'react-bootstrap/Button';
import { HymnDataInterface } from '../interfaces/interfaces';
import DraggableHymnsList from './DraggableHymnsList';

interface Props {
  hymnsData: HymnDataInterface[];
  setHymnsData: (newHymndData: HymnDataInterface[]) => void;
}

const MassHymnChooser: React.FC<Props> = ({ hymnsData, setHymnsData }) => {
  const handleAddHymn: React.MouseEventHandler = (e: React.MouseEvent) => {
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
