import express from 'express';
const router = express.Router();

import { getHymns, getHymn } from '../models/hymns.js';

// Todo - input sanitisation

// Get list of hymns that match search query
router.get('/', async (req, res) => {
  const query = req.query.q;
  if (query) {
    const hymns = await getHymns(query);
    res.json(hymns);
  } else {
    res.status(400).send('No query parameter sent');
  }
});

// Get list of hymns that match search query
router.get('/:id', async (req, res) => {
  const hymnId = req.params.id;
  try {
    const hymns = await getHymn(hymnId);
    res.status(200).json(hymns);
  } catch (e) {
    console.log('err');
    res.status(400).send(`Error getting hymn ${hymnId}: ${e}`);
  }
});

// Update hymn record
router.put('/:id', async (req, res) => {});

export default router;
