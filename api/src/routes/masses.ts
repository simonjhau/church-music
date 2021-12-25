import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

import { postMass, createMassPdf } from '../middleware/masses';
import { getMasses, getMassHymns } from '../models/masses';

// Todo - input sanitisation

// Get list of hymns that match search query
router.get('/', async (req: Request, res: Response) => {
  const query = req.query.q;
  if (query) {
    const hymns = await getMasses(query as string);
    res.json(hymns);
  } else {
    res.status(400).send('No query parameter sent');
  }
});

// Get hymns/files for given mass
router.get('/:id', async (req: Request, res: Response) => {
  const massId = req.params.id;
  try {
    const mass = await getMassHymns(massId);
    res.status(200).send(mass);
  } catch (e) {
    res.status(400).send(`Error getting mass ${massId} from db: \n ${e}`);
  }
});

// Add mass record
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Ensure all required parameters are present
    let massParams = req.body;
    const massParamsRequirements = ['massName', 'massDateTime', 'hymns'];
    for (const param of massParamsRequirements) {
      if (!massParams[param]) {
        res.status(400).send(`Missing parameter '${param}'`);
        return;
      }
    }
    next();
  },
  postMass,
  createMassPdf
);

// Edit mass
router.put(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    // Ensure all required parameters are present
    let massParams = req.body;
    const massParamsRequirements = ['massName', 'massDateTime', 'hymns'];
    for (const param of massParamsRequirements) {
      if (!massParams[param]) {
        res.status(400).send(`Missing parameter '${param}'`);
        return;
      }
    }
    next();
  },
  postMass
);

export default router;
