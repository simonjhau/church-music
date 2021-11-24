import express from 'express';
const router = express.Router();
import {
  multerUpload,
  uploadFile,
  deleteLocalFile,
} from '../middleware/files.js';
import { getListOfFiles } from '../models/files.js';
import { getFile } from '../models/s3.js';

// Todo - input sanitisation

// Upload a file
router.post(
  '/',
  multerUpload.single('file'),
  (req, res, next) => {
    let file = req.file;
    if (!file) {
      res.status(400).send('Ensure pdf file is attached');
      return;
    }

    // Ensure all parameters are present
    let fileParams = req.body;
    const fileParamsRequirements = ['hymnId', 'fileTypeId', 'bookId'];
    for (const param of fileParamsRequirements) {
      if (!fileParams[param]) {
        res.status(400).send(`Missing parameter '${param}'`);
        return;
      }
    }
    if (fileParams['bookId'] === 4 && !fileParams['hymnNum']) {
      res.status(400).send(`Missing parameter 'hymnNum'`);
      return;
    }
    next();
  },
  uploadFile,
  deleteLocalFile
);

// Get list of files associated with a hymn
router.get('/hymn/:id', async (req, res) => {
  const hymnId = req.params.id;
  try {
    const files = await getListOfFiles(hymnId);
    res.status(200).json(files);
  } catch (e) {
    res.status(400).send(`Error getting list of files from db: \n ${e}`);
  }
});

// Get file given id
router.get('/:id', async (req, res) => {
  const fileId = req.params.id;
  try {
    const readStream = getFile(fileId);
    readStream.pipe(res);
    //res.status(200).json('ok');
  } catch (e) {
    res.status(400).send(`Error getting file from S3: \n ${e}`);
  }
});

export default router;
