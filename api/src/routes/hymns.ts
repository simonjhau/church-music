import express, { NextFunction, Request, Response } from 'express';
import {
  checkReadHymnPermissions,
  checkWriteHymnPermissions,
} from '../authz/checkPermissions';
import { addHymn, deleteHymn } from '../middleware/hymns';
import { dbGetHymn, dbGetHymns, dbUpdateHymn } from '../models/hymns';

const router = express.Router();

// Todo - input sanitisation

// Add new hymn
router.post(
  '/',
  checkWriteHymnPermissions,
  async (req: Request, res: Response, next: NextFunction) => {
    const hymnParams = req.body;
    if (!hymnParams.name) {
      res.status(400).send('Missing hymn name parameter');
      return;
    }

    next();
  },
  addHymn
);

// Get list of hymns that match search query
router.get(
  '/',
  checkReadHymnPermissions,
  async (req: Request, res: Response) => {
    const query = req.query.q;
    if (query) {
      const hymns = await dbGetHymns(query as string);
      res.json(hymns);
    } else {
      res.status(400).send('No query parameter sent');
    }
  }
);

// Get hymn data for requested hymn ID
router.get(
  '/:id',
  checkReadHymnPermissions,
  async (req: Request, res: Response) => {
    const hymnId = req.params.id;
    try {
      const hymns = await dbGetHymn(hymnId);
      res.status(200).json(hymns);
    } catch (e) {
      res.status(400).send(`Error getting hymn ${hymnId}: ${e}`);
    }
  }
);

// Delete hymn
router.delete(
  '/:id',
  checkWriteHymnPermissions,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
      res.status(400).send('Missing hymn id parameter');
      return;
    }

    next();
  },
  deleteHymn
);

// Update hymn
router.put(
  '/:id',
  checkWriteHymnPermissions,
  async (req: Request, res: Response) => {
    const hymnId = req.params.id;
    const hymnParams = req.body;
    if (!hymnParams.name) {
      res.status(400).send('Missing hymn name parameter');
      return;
    }

    try {
      await dbUpdateHymn(hymnId, hymnParams.name, hymnParams.lyrics);
      res.location(`/hymns/${hymnId}`);
      res.status(200).json('Hymn saved sucessfully');
    } catch (e) {
      res.status(500).json(`Error saving hymn: ${e}`);
    }
  }
);

export default router;
