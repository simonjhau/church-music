import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addMass, addMassHymns } from '../models/masses';
import { dbBegin, dbCommit, dbRollback } from '../models/db';
import { s3DownloadFile } from '../models/s3';
import fs from 'fs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getHymnTypes } from '../models/hymnTypes';

export const postMass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const createMassPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const massParams = req.body;
  const hymns = massParams.hymns;

  const mergedPdf = await PDFDocument.create();
  const helveticaFont = await mergedPdf.embedFont(StandardFonts.Helvetica);

  const page = mergedPdf.addPage();
  const { width, height } = page.getSize();
  const headingFontSize = 30;
  page.drawText(`${massParams.massName}\n`, {
    x: 50,
    y: height - 75,
    size: headingFontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  const dateTime = new Date(massParams.massDateTime);
  const dateFontSize = 20;
  page.drawText(`${dateTime.toUTCString()}`, {
    x: 50,
    y: height - 75 - headingFontSize,
    size: dateFontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  const hymnTypes = await getHymnTypes();
  console.log({ hymnTypes });

  const fontSize = 20;
  hymns.forEach((hymn, index) => {
    page.drawText(`${hymnTypes[hymn.hymnTypeId].name}: ${hymn.name}`, {
      x: 50,
      y: height - 145 - index * 1.5 * fontSize,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
  });

  for (const hymn of hymns) {
    const fileIds = hymn.fileIds;
    for (const fileId of fileIds) {
      // Download file and save locally
      try {
        const pdfFile = await s3DownloadFile(fileId);
        console.log({ pdfFile });
        const filePath = `downloads/${fileId}.pdf`;
        fs.writeFileSync(filePath, pdfFile);
      } catch (e) {
        console.log(e);
      }

      // const writeStream = fs.createWriteStream(filePath);
      // readStream.pipe(writeStream);

      // writeStream.on('finish', async () => {
      //   console.log(`Written`);
      //   const document = await PDFDocument.load(fs.readFileSync(filePath));
      //   const copiedPages = await mergedPdf.copyPages(
      //     document,
      //     document.getPageIndices()
      //   );
      //   copiedPages.forEach((page) => {
      //     console.log('page');
      //     mergedPdf.addPage();
      //   });
      //   console.log('added');
      // });
    }
  }

  mergedPdf.addPage();

  fs.writeFileSync(
    `downloads/${massParams.massName}.pdf`,
    await mergedPdf.save()
  );

  res.status(200).send('ok');
};
