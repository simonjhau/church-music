import express, { Request, Response } from 'express';
import { dbGetBooks } from '../models/books';
const router = express.Router();

// Get list of hymns that match search query
router.get('/', async (req: Request, res: Response) => {
  try {
    const books = await dbGetBooks();
    res.status(200).json(books);
  } catch (e) {
    res.status(400).send(`Error getting list of files from db: \n ${e}`);
  }
});

export default router;
