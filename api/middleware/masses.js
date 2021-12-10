import { v4 as uuidv4 } from 'uuid';
import { addMass, addMassHymns } from '../models/masses.js';
import { dbBegin, dbCommit, dbRollback } from '../models/db.js';

export const postMass = async (req, res, next) => {
  let massParams = req.body;
  massParams.massId = uuidv4();
  console.log(massParams);
  dbBegin();

  // Add mass to masses table
  try {
    await addMass(massParams);
  } catch (e) {
    res.status(500).send(`Failed to add mass to masses table: ${e}`);
    dbRollback();
    return;
  }

  // Add hymns to mass_hymns table
  try {
    await addMassHymns(massParams);
  } catch (e) {
    res.status(500).send(`Failed to add hymns to mass_hymns table: ${e}`);
    dbRollback();
    return;
  }

  dbCommit();
  res.status(200).send(`Mass ${massParams.name} saved`);
};
