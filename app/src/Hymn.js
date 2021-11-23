import './Files.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {} from 'dotenv/config';
import Form from 'react-bootstrap/Form';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { FileTypesContext, BooksContext } from './Hymns';

const Hymn = ({ hymn }) => {
  const fileTypes = useContext(FileTypesContext);
  const books = useContext(BooksContext);
  const [files, setFiles] = useState([{}]);
  console.log(fileTypes);

  // Runs on component load
  useEffect(() => {
    // Get list of files for this hymns
    axios
      .get(`/files/${hymn.id}`)
      .then((res) => {
        console.log(res.data);
        setFiles(res.data);
      })
      .catch(console.log('failed'));
  }, [hymn, setFiles]);

  return (
    <div>
      <h1>{hymn.name}</h1>
      {files &&
        files.map((file) => {
          console.log(file);
          return (
            <div key={file.id}>
              <h3>
                {fileTypes[file.file_type_id]?.type} {' - '}
                {books[file.book_id]?.name} - {file.comment}
              </h3>
            </div>
          );
        })}
    </div>
  );
};

export default Hymn;
