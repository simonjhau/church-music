import Stack from "@mui/material/Stack";
import React from "react";

import { type File, type Hymn } from "../../types";
import { AddEditFileButtonModal } from "./AddEditFileButtonModal";
import { HymnFileLink } from "./HymnFileLink";

interface HymnFilesListProps {
  hymnId: string;
  files: File[];
  setFiles: (files: File[]) => void;
  setHymnData: (hymn: Hymn | null) => void;
  editMode: boolean;
}

export const HymnFilesList: React.FC<HymnFilesListProps> = ({
  hymnId,
  files,
  setFiles,
  setHymnData,
  editMode,
}) => {
  return (
    <Stack
      sx={{
        justifyContent: "flex-start",
        align: "left",
        alignItems: "flex-start",
      }}
    >
      {files.length > 0 &&
        files.map((file) => {
          return (
            <HymnFileLink
              key={`${file.id}-link`}
              hymnId={hymnId}
              file={file}
              setHymnData={setHymnData}
              editMode={editMode}
            />
          );
        })}
      {editMode && (
        <AddEditFileButtonModal hymnId={hymnId} setHymnData={setHymnData} />
      )}
    </Stack>
  );
};
