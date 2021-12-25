import express, { Request, Response } from 'express';
const router = express.Router();

import { getHymns, getHymn } from '../models/hymns';

// Todo - input sanitisation

// Get list of hymns that match search query
router.get('/', async (req: Request, res: Response) => {
  const query = req.query.q;
  if (query) {
    const hymns = await getHymns(query as string);
    res.json(hymns);
  } else {
    res.status(400).send('No query parameter sent');
  }
});

// Get list of hymns that match search query
router.get('/:id', async (req: Request, res: Response) => {
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
router.put('/:id', async (req: Request, res: Response) => {});

export default router;
