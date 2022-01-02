import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { dbBegin, dbCommit, dbRollback } from '../models/db';
import { dbGetHymnTypes } from '../models/hymnTypes';
import {
  dbAddMass,
  dbAddMassFileInfo,
  dbAddMassHymns,
  dbDeleteMass,
  dbDeleteMassHymns,
  dbDuplicateMass,
  dbDuplicateMassHymns,
  dbGetFileId,
  dbUpdateMass,
  HymnInterface,
  MassParamsInterface,
} from '../models/masses';
import { s3DeleteFile, s3DownloadFile, s3UploadFile } from '../models/s3';
import { deleteFilesInDirectory } from '../utils/utils';

export const updateMass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const massId = req.params.id;
  const massParams = req.body;

  dbBegin();

  // Update masses table
  try {
    await dbUpdateMass(massId, massParams);
  } catch (e) {
    res.status(500).send(`Failed to update mass to masses table: ${e}`);
    dbRollback();
    return;
  }

  // Save hymns to mass_hymns table
  try {
    await dbDeleteMassHymns(massId);
    await dbAddMassHymns(massId, massParams);
  } catch (e) {
    res.status(500).send(`Failed to add hymns to mass_hymns table: ${e}`);
    dbRollback();
    return;
  }

  dbCommit();

  next();
};

const streamToFile = (inputStream: Readable, filePath: string) => {
  return new Promise((resolve, reject) => {
    const fileWriteStream = fs.createWriteStream(filePath);
    inputStream.pipe(fileWriteStream).on('finish', resolve).on('error', reject);
  });
};

// Create merged PDF file
export const createMassPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const massParams = req.body as MassParamsInterface;
  const hymns: HymnInterface[] = massParams.hymns;

  const mergedPdf = await PDFDocument.create();
  const helveticaFont = await mergedPdf.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await mergedPdf.embedFont(
    StandardFonts.HelveticaBold
  );

  const page = mergedPdf.addPage();
  const { width, height } = page.getSize();

  // Write heading
  const headingFontSize = 30;
  page.drawText(`${massParams.name}\n`, {
    x: 50,
    y: height - 75,
    size: headingFontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  // Write date
  const dateTime = new Date(massParams.dateTime);
  const dateFontSize = 20;
  const dateTimeString = dateTime.toUTCString();
  page.drawText(`${dateTimeString.substring(0, dateTimeString.length - 7)}`, {
    x: 50,
    y: height - 75 - headingFontSize,
    size: dateFontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  const hymnTypes = await dbGetHymnTypes();

  // Write list of hymns
  const fontSize = 16;
  hymns.forEach((hymn, index) => {
    page.drawText(`${index + 1}. ${hymnTypes[hymn.hymnTypeId].name}:`, {
      x: 50,
      y: height - 145 - index * 1.5 * fontSize,
      size: fontSize,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(hymn.name, {
      x: width / 2 - 75,
      y: height - 145 - index * 1.5 * fontSize,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
  });

  // Create downloads folder if it doesn't exist
  const downloadsFolder = 'downloads/';
  if (!fs.existsSync(downloadsFolder)) {
    fs.mkdirSync(downloadsFolder);
  }

  let hymnIndex = 1;
  for (const hymn of hymns) {
    const fileIds = hymn.fileIds;
    for (const fileId of fileIds) {
      try {
        // Save file locally
        const filePath = `${downloadsFolder}${fileId}.pdf`;
        const file = await s3DownloadFile('music', fileId);
        await streamToFile(file as Readable, filePath);

        // Add file to merged pdf
        const document = await PDFDocument.load(fs.readFileSync(filePath));
        const copiedPages = await mergedPdf.copyPages(
          document,
          document.getPageIndices()
        );
        copiedPages.forEach((page) => {
          const { width, height } = page.getSize();
          page.drawText(`${hymnIndex}`, {
            x: width - 30,
            y: height - 35,
            size: 16,
            font: helveticaFont,
            color: rgb(0, 0, 0),
          });
          mergedPdf.addPage(page);
        });
      } catch (e) {
        console.log(e);
      }
    }
    hymnIndex++;
  }

  fs.writeFileSync(`downloads/${massParams.name}.pdf`, await mergedPdf.save());

  next();
};

// Save mass file to S3
export const saveMassPdfToS3 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //to do
  // Add file to db
  const massId = req.params.id;
  const massParams: MassParamsInterface = req.body;

  let fileId = await dbGetFileId(massId);
  if (!fileId) {
    fileId = uuidv4();
  }

  try {
    await dbAddMassFileInfo(fileId, massId);
  } catch (e) {
    res.status(500).send(`Failed to add mass file to database: ${e}`);
    next();
    return;
  }

  // Add file to s3
  try {
    await s3UploadFile(`downloads/${massParams.name}.pdf`, fileId, 'masses');
    dbCommit();
  } catch (e) {
    dbRollback();
    res.status(500).send(`Failed to add file to S3 bucket: ${e}`);
  }
  deleteFilesInDirectory('downloads/');
  next();
};

export const addMass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newId = uuidv4();
  const massData = req.body;
  try {
    await dbAddMass(newId, massData);
    res.location(`masses/${newId}`);
    res.status(201).send('Mass added successfully');
  } catch (e) {
    res.status(500).send(`Failed to add mass to database: ${e}`);
  }
};

export const deleteMass = async (req: Request, res: Response) => {
  const massId = req.params.id as string;
  try {
    const fileId = await dbGetFileId(massId);
    dbBegin();
    await dbDeleteMassHymns(massId);
    await dbDeleteMass(massId);
    await s3DeleteFile(fileId, 'masses');
    dbCommit();
    res.status(200).send(`Mass successfully deleted from db`);
  } catch (e) {
    dbRollback();
    res.status(500).send(`Error deleting mass from db: \n ${e}`);
  }
};

export const duplicateMass = async (req: Request, res: Response) => {
  const oldMassId = req.params.massId as string;
  const newMassId = uuidv4();

  dbBegin();

  try {
    // Duplicate mass in masses table
    await dbDuplicateMass(oldMassId, newMassId);
    await dbDuplicateMassHymns(oldMassId, newMassId);
    dbCommit();
    res.location(`/masses/${newMassId}`);
    res.status(200).send(`Mass successfully deleted from db`);
  } catch (e) {
    dbRollback();
    res.status(500).send(`Error deleting mass from db: \n ${e}`);
  }
};
