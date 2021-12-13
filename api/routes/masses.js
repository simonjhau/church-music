import express from 'express';
const router = express.Router();

import { postMass } from '../middleware/masses.js';
import { getMasses, getMassHymns } from '../models/masses.js';

// Todo - input sanitisation

// Get list of hymns that match search query
router.get('/', async (req, res) => {
  const query = req.query.q;
  if (query) {
    const hymns = await getMasses(query);
    res.json(hymns);
  } else {
    res.status(400).send('No query parameter sent');
  }
});

// Get hymns/files for given mass
router.get('/:id', async (req, res) => {
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
  async (req, res, next) => {
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

// Edit mass
router.put(
  '/:id',
  async (req, res, next) => {
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
