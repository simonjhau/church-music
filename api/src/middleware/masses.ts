import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { dbBegin, dbCommit, dbRollback } from '../models/db';
import { getHymnTypes } from '../models/hymnTypes';
import {
  addMass,
  addMassHymns,
  dbAddMassFileInfo,
  HymnInterface,
  MassParamsInterface,
} from '../models/masses';
import { s3DownloadFile, s3UploadFile } from '../models/s3';
import { deleteFilesInDirectory } from '../utils/utils';

export const postMass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let massParams = req.body;
  massParams.massId = uuidv4();
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
  const massParams = req.body;
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
  page.drawText(`${massParams.massName}\n`, {
    x: 50,
    y: height - 75,
    size: headingFontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  // Write date
  const dateTime = new Date(massParams.massDateTime);
  const dateFontSize = 20;
  const dateTimeString = dateTime.toUTCString();
  page.drawText(`${dateTimeString.substring(0, dateTimeString.length - 7)}`, {
    x: 50,
    y: height - 75 - headingFontSize,
    size: dateFontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  const hymnTypes = await getHymnTypes();

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

  fs.writeFileSync(
    `downloads/${massParams.massName}.pdf`,
    await mergedPdf.save()
  );

  next();
};

// Save mass file to S3
export const saveMassPdfToS3 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Add file to db
  const fileId = uuidv4();

  const massParams: MassParamsInterface = req.body;

  try {
    var uploadedFile = await dbAddMassFileInfo(fileId, massParams.massId);
  } catch (e) {
    res.status(500).send(`Failed to add mass file to database: ${e}`);
    next();
    return;
  }

  // Add file to s3
  try {
    await s3UploadFile(
      `downloads/${massParams.massName}.pdf`,
      fileId,
      'masses'
    );
    dbCommit();
    res.status(200).json(uploadedFile);
  } catch (e) {
    dbRollback();
    res.status(500).send(`Failed to add file to S3 bucket: ${e}`);
  }

  next();
};

export const pdfCleanup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  deleteFilesInDirectory('downloads/');
  next();
};
