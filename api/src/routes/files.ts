import express, { NextFunction, Request, Response } from 'express';
import { Readable } from 'stream';
import { deleteLocalFile, multerUpload, uploadFile } from '../middleware/files';
import { s3DownloadFile } from '../models/s3';
const router = express.Router();

// Todo - input sanitisation

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
    const fileParamsRequirements = ['hymnId', 'fileTypeId', 'bookId'];
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
  deleteLocalFile
);

// Get file given id
router.get('/:id', async (req: Request, res: Response) => {
  const fileId = req.params.id;
  try {
    const file = await s3DownloadFile('music', fileId);
    (file as Readable).pipe(res);
  } catch (e) {
    res.status(400).send(`Error downloading file from S3: \n ${e}`);
  }
});

export default router;
