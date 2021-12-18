import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useFileTypes, useBooks } from '../context/TypesAndBooksContext';
import '../styles/Hymn.css';
import { HymnInterface } from '../interfaces/interfaces';

interface FileInterface {
  id: string;
  fileTypeId: number;
  bookId: number;
  hymnNum: Number;
  comment: string;
}

interface Props {
  hymn: HymnInterface;
}

const Hymn: React.FC<Props> = ({ hymn }) => {
  const fileTypes = useFileTypes();
  const books = useBooks();

  const [files, setFiles] = useState<FileInterface[]>([
    { id: '', fileTypeId: 0, bookId: 0, hymnNum: 0, comment: '' },
  ]);

  // Runs on component load
  useEffect(() => {
    // Get list of files for this hymns
    axios
      .get(`/files/hymn/${hymn.id}`)
      .then((res) => {
        setFiles(res.data);
      })
      .catch((e) => console.log('Get files failed'));
  }, [hymn, setFiles]);

  const handleFileClick: React.MouseEventHandler = (e: React.MouseEvent) => {
    window.open(
      `${process.env.REACT_APP_API_URL}/files/${
        (e.target as HTMLButtonElement).id
      }`
    );
  };

  return (
    <div>
      <h1>{hymn.name}</h1>
      <h3>{hymn.altName ? `(${hymn.altName})` : ''}</h3>
      <br />
      <h4>Music Files</h4>
      {files.length > 0 &&
        files.map((file) => {
          return (
            <div key={file.id}>
              <Button variant="link" id={file.id} onClick={handleFileClick}>
                {
                  fileTypes.find((fileType) => fileType.id === file.fileTypeId)
                    ?.name
                }
                {' - '}
                {books.find((book) => book.id === file.bookId)?.name}
                {file.hymnNum ? ` - ${file.hymnNum}` : ''}
                {file.comment ? ` - ${file.comment}` : ''}
              </Button>
              <br />
            </div>
          );
        })}
      {hymn.lyrics && (
        <div className="lyrics">
          <br />
          <h4>Lyrics</h4>
          <p>{hymn.lyrics}</p>
        </div>
      )}
    </div>
  );
};

export default Hymn;
