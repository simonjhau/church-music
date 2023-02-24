import React from "react";

import { type File } from "../../types";
// import AddEditFileButtonModal, {
//   ModalType,
// } from "../AddEditFileButtonModal/AddEditFileButtonModal";
import { HymnFileLink } from "./HymnFileLink";

interface HymnFilesListProps {
  hymnId: string;
  files: File[];
  setFiles: (files: File[]) => void;
  refreshHymnData: (endpoint: string) => void;
  editMode: boolean;
}

export const HymnFilesList: React.FC<HymnFilesListProps> = ({
  hymnId,
  files,
  setFiles,
  refreshHymnData,
  editMode,
}) => {
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
              editMode={editMode}
            />
          );
        })}
      {/* {editMode && (
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
      )} */}
    </div>
  );
};
