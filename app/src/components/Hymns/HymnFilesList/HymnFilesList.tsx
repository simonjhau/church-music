import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useEditMode } from '../../../context/EditModeContext';
import { FileInterface } from '../../../interfaces/interfaces';
import AddEditFileButtonModal, {
  ModalType,
} from '../AddEditFileButtonModal/AddEditFileButtonModal';
import HymnFileLink from '../HymnFileLink/HymnFileLink';

interface HymnFilesListProps {
  hymnId: string;
  files: FileInterface[];
  setFiles: (files: FileInterface[]) => void;
  refreshHymnData: (endpoint: string) => void;
}

const HymnFilesList: React.FC<HymnFilesListProps> = ({
  hymnId,
  files,
  setFiles,
  refreshHymnData,
}) => {
  const { editMode } = useEditMode();

  return (
    <div>
      {files.length > 0 &&
        files.map((file) => {
          return (
            <HymnFileLink
              key={file.id}
              hymnId={hymnId}
              file={file}
              refreshHymnData={refreshHymnData}
            />
          );
        })}
      {editMode && (
        <Row>
          <Col className="d-grid">
            <AddEditFileButtonModal
              modalType={ModalType.Add}
              hymnId={hymnId}
              refreshHymnData={refreshHymnData}
            />
          </Col>
          <Col></Col>
        </Row>
      )}
    </div>
  );
};

export default HymnFilesList;
