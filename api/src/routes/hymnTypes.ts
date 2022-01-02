import express, { Request, Response } from 'express';
import { dbGetHymnTypes } from '../models/hymnTypes';
const router = express.Router();

// Get list of hymns that match search query
router.get('/', async (req: Request, res: Response) => {
  try {
    const hymnTypes = await dbGetHymnTypes();
    res.status(200).json(hymnTypes);
  } catch (e) {
    res.status(400).send(`Error getting list of hymn types from db: \n ${e}`);
  }
});

export default router;
