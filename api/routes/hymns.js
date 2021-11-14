import express from 'express';
const router = express.Router();

import { getHymns } from '../middleware/db.js';

// Todo - input sanitisation

// Get list of hymns that match search query
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

// Add a hymn to the database
router.post('/', async (req, res) => {
  const file = req.file;
  console.log(file);
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  console.log(result);
  const description = req.body.description;
  res.send({ imagePath: `/upload/${result.Key}` });
});

// Update hymn record
router.put('/:id', async (req, res) => {});

export default router;
