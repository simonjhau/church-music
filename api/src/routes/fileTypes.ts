import express, { Request, Response } from 'express';
import { dbGetFiletypes } from '../models/fileTypes';
const router = express.Router();

// Get list of hymns that match search query
router.get('/', async (req: Request, res: Response) => {
  try {
    const fileTypes = await dbGetFiletypes();
    res.status(200).json(fileTypes);
  } catch (e) {
    res.status(400).send(`Error getting list of files from db: \n ${e}`);
  }
});

export default router;
