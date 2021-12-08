import express from 'express';
const router = express.Router();

import { getMasses, getMass } from '../models/masses.js';

// Todo - input sanitisation

// Get list of hymns that match search query
router.get('/', async (req, res) => {
  const query = req.query.q;
  if (query) {
    const hymns = await getMasses(query);
    res.json(hymns);
  } else {
    res.status(400).send('No query parameter sent');
  }
});

// Get hymns/files for given mass
router.get('/:id', async (req, res) => {
  const massId = req.params.id;
  const mass = getMass(massId);
  res.status(200).send('mass');
});

// Add mass record
router.post('/', async (req, res) => {});

export default router;
