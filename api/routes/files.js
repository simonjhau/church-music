import express from 'express';
const router = express.Router();

import multer from 'multer';
const upload = multer({ dest: 'upload/' });

import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);

import { uploadFile, getFile, getListOfFiles } from '../middleware/s3.js';
import { getHymns } from '../middleware/db.js';

// Get list of hymns that match search query
// Todo - input sanitisation
router.get('/', async (req, res) => {
  const query = req.query.q;
  if (query) {
    const hymns = await getHymns(query);
    res.json(hymns);
  } else {
    res.status(510).send('No query parameter');
  }
});

// Get list of files for selected hymn
router.get('/:id', (req, res) => {
  console.log({ req });
  console.log('id');
  const query = req.query.query;
});

router.post('/', upload.single('image'), async (req, res) => {
  const file = req.file;
  console.log(file);
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  console.log(result);
  const description = req.body.description;
  res.send({ imagePath: `/upload/${result.Key}` });
});

router.get('/list', (req, res) => {
  const readStream = getListOfFiles();
  readStream.pipe(res);
});

router.get('/db', (req, res) => {
  console.log('db!');
  sendQuery();
  res.send('all good');
});

export default router;
