import {} from 'dotenv/config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFileTypes, useBooks } from './FileTypesAndBooksContext';
import './Hymn.css';

const Hymn = ({ hymn }) => {
  const fileTypes = useFileTypes();
  const books = useBooks();

  const [files, setFiles] = useState([{}]);

  // Runs on component load
  useEffect(() => {
    // Get list of files for this hymns
    axios
      .get(`/files/${hymn.id}`)
      .then((res) => {
        setFiles(res.data);
      })
      .catch(console.log('failed'));
  }, [hymn, setFiles]);

  return (
    <div>
      <h1>{hymn.name}</h1>
      <h3>{hymn.altName ? `(${hymn.altName})` : ''}</h3>
      <br />
      <h4>Music Files</h4>
      {files && (
        <p>
          {files.map((file) => {
            return (
              <div key={file.fileId}>
                {fileTypes[file.fileTypeId]?.type} {' - '}
                {books[file.bookId]?.name} - {file.comment}
              </div>
            );
          })}
        </p>
      )}
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
