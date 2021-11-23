import { v4 as uuidv4 } from 'uuid';
import { dbAddFile } from '../models/files.js';
import { s3UploadFile } from '../models/s3.js';
import { dbCommit, dbRollback } from '../models/db.js';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

// Set multer disk storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Multer settings
export const multerUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.pdf') {
      return cb(new Error('Only pdfs are allowed'));
    }
    cb(null, true);
  },
});

// Delete local file after uploading
export const deleteLocalFile = (req, res, next) => {
  fs.promises
    .unlink(req.file.path)
    .catch((e) => console.log('Problem deleting file'));
};

export const uploadFile = async (req, res, next) => {
  // To do checking of params should be done one level higher
  // Ensure file has been sent

  // Add file to db
  const newId = uuidv4();
  let fileParams = req.body;
  fileParams['id'] = newId;
  try {
    var uploadedFile = await dbAddFile(fileParams);
  } catch (e) {
    res.status(500).send(`Failed to add file to database: ${e}`);
    next();
    return;
  }

  // Add file to s3
  try {
    await s3UploadFile(req.file, newId);
    dbCommit();
    res.status(200).json(uploadedFile);
  } catch (e) {
    dbRollback();
    res.status(500).send(`Failed to add file to S3 bucket: ${e}`);
  }

  next();
};
