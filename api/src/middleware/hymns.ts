import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbAddHymn, dbDeleteHymn } from '../models/hymns';

export const addHymn = async (req: Request, res: Response) => {
  // Ensure file has been sent

  // Add file to db
  const newId = uuidv4();
  const { name, altName } = req.body;

  try {
    await dbAddHymn(newId, name, altName);
    res.location(`/hymns/${newId}`);
    res.status(201).send(`Hymn successfully aded to database`);
  } catch (e) {
    res.status(500).send(`Failed to add hymn to database: ${e}`);
  }
};

export const deleteHymn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hymnId = req.params.id;

  try {
    await dbDeleteHymn(hymnId);
    res.status(200).send(`Hymn deleted successfully`);
  } catch (e) {
    res.status(500).send(`Failed to delete hymn from database: ${e}`);
  }
};
