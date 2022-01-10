import express, { NextFunction, Request, Response } from 'express';
import {
  checkReadMassPermissions,
  checkWriteMassPermissions,
} from '../authz/checkPermissions';
import {
  addMass,
  createMassPdf,
  deleteMass,
  duplicateMass,
  saveMassPdfToS3,
  updateMass,
} from '../middleware/masses';
import {
  dbGetAllMasses,
  dbGetFileId,
  dbGetMassData,
  dbGetMassesQueryName,
  dbGetMassHymns,
} from '../models/masses';
import { s3GetSignedUrl } from '../models/s3';

const router = express.Router();

// Todo - input sanitisation

// Get list of masses that match search query
router.get(
  '/',
  checkReadMassPermissions,
  async (req: Request, res: Response) => {
    const query = req.query.q as string;
    try {
      if (query) {
        const masses = await dbGetMassesQueryName(query);
        res.json(masses);
      } else {
        const masses = await dbGetAllMasses();
        res.json(masses);
      }
    } catch (e) {
      res.status(500).send(`Error getting masses from db: \n ${e}`);
    }
  }
);

// Get mass data for given mass id
router.get(
  '/:id',
  checkWriteMassPermissions,
  async (req: Request, res: Response) => {
    const massId = req.params.id;
    try {
      const mass = await dbGetMassData(massId);
      res.status(200).send(mass);
    } catch (e) {
      res.status(400).send(`Error getting mass ${massId} from db: \n ${e}`);
    }
  }
);

// Get hymns/files for given mass
router.get(
  '/:id/hymns',
  checkReadMassPermissions,
  async (req: Request, res: Response) => {
    const massId = req.params.id;
    try {
      const mass = await dbGetMassHymns(massId);
      res.status(200).send(mass);
    } catch (e) {
      res.status(400).send(`Error getting mass ${massId} from db: \n ${e}`);
    }
  }
);

// Get mass file given mass id
router.get(
  '/:massId/file',
  checkReadMassPermissions,
  async (req: Request, res: Response) => {
    const massId = req.params.massId;
    try {
      const fileId = await dbGetFileId(massId);
      const url = await s3GetSignedUrl('masses', fileId);
      res.status(200).json(url);
    } catch (e) {
      res.status(400).send(`Error downloading file from S3: \n ${e}`);
    }
  }
);

// Add mass record
router.post(
  '/',
  checkWriteMassPermissions,
  async (req: Request, res: Response, next: NextFunction) => {
    // Ensure all required parameters are present
    const massParams = req.body;
    const massParamsRequirements = ['name', 'dateTime'];
    for (const param of massParamsRequirements) {
      if (!massParams[param]) {
        res.status(400).send(`Missing parameter '${param}'`);
        return;
      }
    }
    next();
  },
  addMass
);

// Duplicate mass record
router.post('/:massId/copy', checkWriteMassPermissions, duplicateMass);

// Edit mass
router.put(
  '/:id',
  checkWriteMassPermissions,
  async (req: Request, res: Response, next: NextFunction) => {
    // Ensure all required parameters are present
    const massParams = req.body;
    const massParamsRequirements = ['name', 'dateTime', 'hymns'];
    for (const param of massParamsRequirements) {
      if (!massParams[param]) {
        res.status(400).send(`Missing parameter '${param}'`);
        return;
      }
    }
    next();
  },
  updateMass,
  createMassPdf,
  saveMassPdfToS3,
  async (req: Request, res: Response, next: NextFunction) => {
    const massId = req.params.id;
    res.location(`/masses/${massId}`);
    res.status(200).send('Mass saved successfully');
  }
);

// Delete mass given ID
router.delete('/:id', checkWriteMassPermissions, deleteMass);

export default router;
