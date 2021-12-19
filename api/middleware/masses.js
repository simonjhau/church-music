import { v4 as uuidv4 } from 'uuid';
import { addMass, addMassHymns } from '../models/masses.js';
import { dbBegin, dbCommit, dbRollback } from '../models/db.js';
import { s3DownloadFile } from '../models/s3.js';
import fs from 'fs';
import PDFMerger from 'pdf-merger-js';

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

  next();
};

export const createMassPdf = async (req, res, next) => {
  const massParams = req.body;
  const hymns = massParams.hymns;
  const merger = new PDFMerger();

  for (const hymn of hymns) {
    const fileIds = hymn.fileIds;
    for (const fileId of fileIds) {
      // Download file and save locally
      const readStream = s3DownloadFile(fileId);
      const filePath = `downloads/${fileId}.pdf`;
      readStream.pipe(fs.createWriteStream(filePath));
      merger.add(filePath);
    }
  }

  const massName = massParams.massName;
  merger.save(`downloads/${massName}.pdf`);

  res.status(200).send('ok');
};
