import express from 'express';
const router = express.Router();

import { getHymnTypes } from '../models/hymnTypes.js';

// Todo - input sanitisation

// Get list of hymns that match search query
router.get('/', async (req, res) => {
  try {
    const hymnTypes = await getHymnTypes();
    res.status(200).json(hymnTypes);
  } catch {
    res.status(400).send(`Error getting list of hymn types from db: \n ${e}`);
  }
});

export default router;
