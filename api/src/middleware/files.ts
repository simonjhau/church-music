import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { dbAddFile } from '../models/files';
import { s3UploadFile } from '../models/s3';
import { dbCommit, dbRollback } from '../models/db';

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
export const deleteLocalFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const path = req?.file?.path;
  if (path) {
    fs.promises
      .unlink(path)
      .catch((e) => console.log(`Problem deleting file: ${e}`));
  }
};

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
