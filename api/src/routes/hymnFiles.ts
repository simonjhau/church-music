import express, { NextFunction, Request, Response } from 'express';
import { Readable } from 'stream';
import {
  deleteFile,
  deleteLocalFile,
  multerUpload,
  uploadFile,
} from '../middleware/hymnFiles';
import { dbGetFile, dbGetListOfFiles, dbUpdateFile } from '../models/hymnFiles';
import { s3DownloadFile } from '../models/s3';
const router = express.Router({ mergeParams: true });
// Todo - input sanitisation

// Get list of files associated with a hymn
router.get('/', async (req: Request, res: Response) => {
  const hymnId = req.params.hymnId;
  try {
    const files = await dbGetListOfFiles(hymnId);
    res.status(200).json(files);
  } catch (e) {
    res.status(400).send(`Error getting list of files from db: \n ${e}`);
  }
});

// Get file data given file ID
router.get('/:fileId', async (req: Request, res: Response) => {
  const hymnId = req.params.hymnId;
  const fileId = req.params.fileId;
  try {
    const fileData = await dbGetFile(hymnId, fileId);
    res.status(200).json(fileData);
  } catch (e) {
    res.status(400).send(`Error getting file data from database: \n ${e}`);
  }
});

// Get file given file ID
router.get('/:id/file', async (req: Request, res: Response) => {
  const fileId = req.params.id;
  try {
    const file = await s3DownloadFile('music', fileId);
    (file as Readable).pipe(res);
  } catch (e) {
    res.status(400).send(`Error downloading file from S3: \n ${e}`);
  }
});

// Upload a file
router.post(
  '/',
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      res.status(400).send('Ensure pdf file is attached');
      return;
    }

    // Ensure all parameters are present
    const fileParams = req.body;
    const fileParamsRequirements = ['fileTypeId', 'bookId'];
    for (const param of fileParamsRequirements) {
      if (!fileParams[param]) {
        res.status(400).send(`Missing parameter '${param}'`);
        return;
      }
    }
    if (fileParams.bookId === 4 && !fileParams.hymnNum) {
      res.status(400).send(`Missing parameter 'hymnNum'`);
      return;
    }
    next();
  },
  uploadFile,
  deleteLocalFile,
  (req: Request, res: Response) => {
    // res.location(`/hymns/${req.params.hymnId}/files`)
    res.status(201);
  }
);

// Delete file
router.delete('/:fileId', deleteFile);

// Update file given file ID
router.put('/:fileId', async (req: Request, res: Response) => {
  const hymnId = req.params.hymnId;
  const fileId = req.params.fileId;
  const fileParams = req.body;
  try {
    await dbUpdateFile(hymnId, fileId, fileParams);
    res.status(200).json();
  } catch (e) {
    res.status(400).send(`Error updating file: \n ${e}`);
  }
});

export default router;
