import express, { Request, Response } from 'express';
import { getHymnTypes } from '../models/hymnTypes';
const router = express.Router();

// Todo - input sanitisation

// Get list of hymns that match search query
router.get('/', async (req: Request, res: Response) => {
  try {
    const hymnTypes = await getHymnTypes();
    res.status(200).json(hymnTypes);
  } catch (e) {
    res.status(400).send(`Error getting list of hymn types from db: \n ${e}`);
  }
});

export default router;
