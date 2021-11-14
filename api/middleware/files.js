import { v4 as uuidv4 } from 'uuid';
import { dbAddFile } from '../models/files.js';
import { s3UploadFile } from '../models/s3.js';
import { dbCommit, dbRollback } from '../models/db.js';

export const uploadFile = async (req, res, next) => {
  // To do checking of params should be done one level higher
  // Ensure file has been sent
  let file = req.file;
  if (!file) {
    res.status(400).send('Ensure pdf file is attached');
    return;
  }

  // Ensure all parameters are present
  let fileParams = req.body;
  const fileParamsRequirements = [
    'hymnId',
    'fileTypeId',
    'bookId',
    'hymnNum',
    'comment',
  ];
  for (const param of fileParamsRequirements) {
    if (!fileParams[param]) {
      res.status(400).send(`Missing parameter '${param}'`);
      return;
    }
  }

  // Add file to db
  const newId = uuidv4();
  fileParams['id'] = newId;
  try {
    var uploadedFile = await dbAddFile(fileParams);
  } catch {
    res.status(500).send(`Failed to add file to database`);
    return;
  }

  // Add file to s3
  try {
    await s3UploadFile(file, newId);
    dbCommit();
    res.status(200).json(uploadedFile);
  } catch {
    dbRollback();
    res.status(500).send(`Failed to add file to S3 bucket`);
  }
};
