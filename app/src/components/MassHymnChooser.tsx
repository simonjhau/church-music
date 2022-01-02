import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useEditMode } from '../context/EditModeContext';
import { HymnDataInterface } from '../interfaces/interfaces';
import DraggableHymnsList from './DraggableHymnsList';

interface Props {
  hymnsData: HymnDataInterface[];
  setHymnsData: (newHymndData: HymnDataInterface[]) => void;
}

const MassHymnChooser: React.FC<Props> = ({ hymnsData, setHymnsData }) => {
  const { editMode } = useEditMode();

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
      {editMode && (
        <Row>
          {' '}
          <Button
            className="d-grid"
            variant="outline-primary"
            onClick={handleAddHymn}
          >
            +
          </Button>{' '}
        </Row>
      )}
    </div>
  );
};

export default MassHymnChooser;
