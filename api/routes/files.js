import express from 'express';
const router = express.Router();
import {
  multerUpload,
  uploadFile,
  deleteLocalFile,
} from '../middleware/files.js';
import { getListOfFiles } from '../models/files.js';

// Todo - input sanitisation

// Upload a file
router.post(
  '/',
  (req, res, next) => {
    let file = req.file;
    if (!file) {
      res.status(400).send('Ensure pdf file is attached');
      return;
    }

    // Ensure all parameters are present
    let fileParams = req.body;
    const fileParamsRequirements = [
      'hymnId',
      'fileTypeId',
      'bookId',
      'hymnNum',
      'comment',
    ];
    for (const param of fileParamsRequirements) {
      if (!fileParams[param]) {
        res.status(400).send(`Missing parameter '${param}'`);
        return;
      }
    }
  },
  multerUpload.single('file'),
  uploadFile,
  deleteLocalFile
);

// Get list of files associated with a hymn
router.get('/:id', async (req, res) => {
  const hymnId = req.params.id;
  try {
    const files = await getListOfFiles(hymnId);
    console.log(files);
    res.status(200).json(files);
  } catch (e) {
    res.status(400).send(`Error getting list of files from db: \n ${e}`);
  }
});

export default router;
