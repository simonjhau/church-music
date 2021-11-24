import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useFileTypes, useBooks } from './FileTypesAndBooksContext';
import './Hymn.css';

const Hymn = ({ hymn }) => {
  const fileTypes = useFileTypes();
  const books = useBooks();

  const [files, setFiles] = useState([{ id: null }]);

  // Runs on component load
  useEffect(() => {
    // Get list of files for this hymns
    axios
      .get(`/files/hymn/${hymn.id}`)
      .then((res) => {
        setFiles(res.data);
      })
      .catch(console.log('Get files failed'));
  }, [hymn, setFiles]);

  const handleFileClick = (e) => {
    window.open(`${process.env.REACT_APP_API_URL}/files/${e.target.id}`);
  };

  return (
    <div>
      <h1>{hymn.name}</h1>
      <h3>{hymn.altName ? `(${hymn.altName})` : ''}</h3>
      <br />
      <h4>Music Files</h4>
      {files &&
        files.map((file) => {
          return (
            <div key={file.id}>
              <Button variant="link" id={file.id} onClick={handleFileClick}>
                {
                  fileTypes.find((fileType) => fileType.id === file.fileTypeId)
                    ?.type
                }{' '}
                {' - '}
                {books.find((book) => book.id === file.bookId)?.name} -{' '}
                {file.comment}
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
