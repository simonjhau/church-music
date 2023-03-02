import Stack from "@mui/material/Stack";
import React from "react";

import { type File } from "../../types";
import { AddEditFileButtonModal } from "./AddEditFileButtonModal";
import { HymnFileLink } from "./HymnFileLink";

interface HymnFilesListProps {
  hymnId: string;
  files: File[];
  setFiles: (files: File[]) => void;
  editMode: boolean;
}

export const HymnFilesList: React.FC<HymnFilesListProps> = ({
  hymnId,
  files,
  setFiles,
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
              setFiles={setFiles}
              editMode={editMode}
            />
          );
        })}
      {editMode && (
        <AddEditFileButtonModal
          hymnId={hymnId}
          setFiles={setFiles}
          fileId={null}
        />
      )}
    </Stack>
  );
};
