import axios from 'axios';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useBooks, useFileTypes } from '../../context/TypesAndBooksContext';
import { FileInterface } from '../../interfaces/interfaces';
import './FileCheckBoxes.css';

interface Props {
  label: string;
  hymnId: string;
  selectedFileIds: string[];
  updateSelectedFiles: (selectedFiles: string[]) => void;
  disabled: boolean;
}

const FileCheckBoxes: React.FC<Props> = ({
  label,
  hymnId,
  selectedFileIds,
  updateSelectedFiles,
  disabled,
}) => {
  const books = useBooks();
  const fileTypes = useFileTypes();

  const [files, setfiles] = useState<FileInterface[]>([]);
  const [selected, setSelected] = useState<boolean[]>([]);

  // Get new files if a new hymn is selected
  useEffect(() => {
    if (hymnId) {
      axios
        .get(`/hymns/${hymnId}/files`)
        .then((res) => {
          const files = res.data as FileInterface[];
          setfiles(res.data);

          const newSelected = files.map((file) =>
            selectedFileIds.includes(file.id)
          );
          setSelected(newSelected);
        })
        .catch((e) => console.error(`Get files failed ${e}`));
    }
    // eslint-disable-next-line
  }, [hymnId]);

  // Change checked boxes if selected hymns changes
  useEffect(() => {
    const newSelected = files.map((file) => selectedFileIds.includes(file.id));
    setSelected(newSelected);
    // eslint-disable-next-line
  }, [selectedFileIds]);

  const onFileClicked = (fileIndex: number) => {
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
    <Form.Group
      as={Row}
      className="mb-3 checkBoxes"
      controlId="formPlaintextHymnName"
    >
      <Form.Label column sm="3">
        {label}:
      </Form.Label>
      {files.length > 0 && files.length === selected.length && (
        <Col sm="9">
          {files.map((file, fileIndex) => {
            return (
              <Form.Check
                className="checkBox"
                type="checkbox"
                id={file.id}
                key={file.id}
                checked={selected[fileIndex]}
                onChange={(e) => onFileClicked(fileIndex)}
                disabled={disabled}
                label={`
                ${
                  fileTypes.find((fileType) => fileType.id === file.fileTypeId)
                    ?.name
                } - ${books.find((book) => book.id === file.bookId)?.name} ${
                  file.hymnNum ? ` - ${file.hymnNum}` : ''
                } ${file.comment ? ` - ${file.comment}` : ''}`}
              />
            );
          })}
        </Col>
      )}
    </Form.Group>
  );
};

export default FileCheckBoxes;
