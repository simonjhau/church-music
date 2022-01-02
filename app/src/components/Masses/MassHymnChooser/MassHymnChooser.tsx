import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { HymnDataInterface } from '../../../interfaces/interfaces';
import DraggableHymnsList from '../DraggableHymnsList/DraggableHymnsList';

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
    <div>
      <DraggableHymnsList hymnsData={hymnsData} setHymnsData={setHymnsData} />
      <Row>
        {' '}
        <Button
          className="d-grid gap-2"
          variant="outline-primary"
          onClick={handleAddHymn}
        >
          +
        </Button>{' '}
      </Row>
    </div>
  );
};

export default MassHymnChooser;
