import express, { NextFunction, Request, Response } from 'express';
import { Readable } from 'stream';
import {
  createMassPdf,
  pdfCleanup,
  postMass,
  saveMassPdfToS3,
} from '../middleware/masses';
import {
  getAllMasses,
  getMassesQueryName,
  getMassHymns,
} from '../models/masses';
import { s3DownloadFile } from '../models/s3';

const router = express.Router();

// Todo - input sanitisation

// Get list of masses that match search query
router.get('/', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  try {
    if (query) {
      const masses = await getMassesQueryName(query);
      res.json(masses);
    } else {
      const masses = await getAllMasses();
      res.json(masses);
    }
  } catch (e) {
    res.status(500).send(`Error getting masses from db: \n ${e}`);
  }
});

// Get mass data for given mass id
router.get('/:id', async (req: Request, res: Response) => {
  // const massId = req.params.id;
  // try {
  //   const mass = await getMassHymns(massId);
  //   res.status(200).send(mass);
  // } catch (e) {
  //   res.status(400).send(`Error getting mass ${massId} from db: \n ${e}`);
  // }
});

// Get hymns/files for given mass
router.get('/:id/hymns', async (req: Request, res: Response) => {
  const massId = req.params.id;
  try {
    const mass = await getMassHymns(massId);
    res.status(200).send(mass);
  } catch (e) {
    res.status(400).send(`Error getting mass ${massId} from db: \n ${e}`);
  }
});

// Get file given mass id
router.get('/files/:id', async (req: Request, res: Response) => {
  const fileId = req.params.id;
  try {
    const file = await s3DownloadFile('masses', fileId);
    (file as Readable).pipe(res);
  } catch (e) {
    res.status(400).send(`Error downloading file from S3: \n ${e}`);
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
  createMassPdf,
  saveMassPdfToS3,
  pdfCleanup
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
