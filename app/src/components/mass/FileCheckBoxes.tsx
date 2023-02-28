import { useAuth0 } from "@auth0/auth0-react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useBooks, useFileTypes } from "../../context/TypesAndBooksContext";
import { type File, FileSchema } from "../../types";
import { parseData } from "../../utils";

interface Props {
  label: string;
  hymnId: string;
  selectedFileIds: string[];
  updateSelectedFiles: (selectedFiles: string[]) => void;
  disabled?: boolean;
}

export const FileCheckBoxes: React.FC<Props> = ({
  label,
  hymnId,
  selectedFileIds,
  updateSelectedFiles,
  disabled = false,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const books = useBooks();
  const fileTypes = useFileTypes();

  const [files, setFiles] = useState<File[]>([]);
  const [selected, setSelected] = useState<boolean[]>([]);

  // Get new files if a new hymn is selected
  useEffect(() => {
    const getFiles = async (): Promise<void> => {
      if (hymnId) {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`api/hymns/${hymnId}/files`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const files = res.data;
        const validFiles = parseData(
          z.array(FileSchema),
          files,
          "Problem getting files"
        );

        setFiles(validFiles);

        const newSelected = validFiles.map((file) =>
          selectedFileIds.includes(file.id)
        );
        setSelected(newSelected);
      } else {
        setFiles([]);
      }
    };
    getFiles().catch((err) => {
      const msg = err instanceof Error ? err.message : "Unknonn error";
      alert(msg);
    });
    // eslint-disable-next-line
  }, [hymnId]);

  // Change checked boxes if selected hymns changes
  useEffect(() => {
    const newSelected = files.map((file) => selectedFileIds.includes(file.id));
    setSelected(newSelected);
    // eslint-disable-next-line
  }, [selectedFileIds]);

  const onFileClicked = (fileIndex: number): void => {
    selected[fileIndex] = !selected[fileIndex];

    const newSelectedHymns: string[] = [];
    files.forEach((file, fileIndex) => {
      if (selected[fileIndex]) {
        newSelectedHymns.push(file.id);
      }
    });

    updateSelectedFiles(newSelectedHymns);
  };

  return (
    <FormGroup>
      {files.length > 0 &&
        files.length === selected.length &&
        files.map((file, fileIndex) => {
          return (
            <FormControlLabel
              key={file.id}
              label={`
          ${
            fileTypes.find((fileType) => fileType.id === file.fileTypeId)
              ?.name ?? ""
          } - ${books.find((book) => book.id === file.bookId)?.name ?? ""} ${
                file.hymnNum ? ` - ${file.hymnNum}` : ""
              } ${file.comment ? ` - ${file.comment}` : ""}`}
              control={
                <Checkbox
                  checked={selected[fileIndex]}
                  onChange={(e) => {
                    onFileClicked(fileIndex);
                  }}
                />
              }
            />
          );
        })}
    </FormGroup>
  );
};
