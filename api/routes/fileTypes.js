import express from 'express';
const router = express.Router();

import { getFiletypes } from '../models/fileTypes.js';

// Todo - input sanitisation

// Get list of hymns that match search query
router.get('/', async (req, res) => {
  try {
    const fileTypes = await getFiletypes();
    res.status(200).json(fileTypes);
  } catch {
    res.status(400).send(`Error getting list of files from db: \n ${e}`);
  }
});

export default router;
