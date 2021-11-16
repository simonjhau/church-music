import express from 'express';
const router = express.Router();

import { getBooks } from '../models/books.js';

// Todo - input sanitisation

// Get list of hymns that match search query
router.get('/', async (req, res) => {
  try {
    const books = await getBooks();
    res.status(200).json(books);
  } catch {
    res.status(400).send(`Error getting list of files from db: \n ${e}`);
  }
});

export default router;
