import fs from "fs";
import multer from "multer";
import path from "path";

import { dbBeginTransaction, dbCommit, dbRollback } from "../db";
import {
  dbAddFile,
  dbDeleteFile,
  type DbFileParams,
  type UploadedFileParams,
} from "../db/hymnFiles";
import { s3DeleteFile, s3UploadFile } from "../s3";

// Set multer disk storage settings
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadsFolder = "uploads/";
    if (!fs.existsSync(uploadsFolder)) {
      fs.mkdirSync(uploadsFolder);
    }
    cb(null, uploadsFolder);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Multer settings
export const multerUpload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (path.extname(file.originalname) !== ".pdf") {
      cb(new Error("Only pdfs are allowed"));
      return;
    }
    cb(null, true);
  },
});

// Delete local file after uploading
export const deleteLocalFile = async (path: string): Promise<void> => {
  await fs.promises.unlink(path);
};

export const uploadFile = async (
  fileParams: UploadedFileParams,
  hymnId: string,
  file: Express.Multer.File,
): Promise<DbFileParams> => {
  try {
    await dbBeginTransaction();
    const uploadedFile = await dbAddFile(fileParams, hymnId);
    await s3UploadFile(file.path, uploadedFile.id, "music");
    await dbCommit();
    await deleteLocalFile(file.path);
    return uploadedFile;
  } catch (err) {
    await dbRollback();
    throw err;
  }
};

export const deleteFile = async (
  hymnId: string,
  fileId: string,
): Promise<void> => {
  try {
    await dbBeginTransaction();
    await dbDeleteFile(hymnId, fileId);
    await s3DeleteFile(fileId, "music");
    await dbCommit();
  } catch (err) {
    await dbRollback();
    throw err;
  }
};
