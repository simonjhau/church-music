import fs from "fs";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { type Readable } from "stream";
import { v4 as uuidv4 } from "uuid";

import { dbGetHymnTypes } from "../db/hymnTypes";
import { dbBeginTransaction, dbCommit, dbRollback } from "../db/index";
import {
  dbAddMassFileInfo,
  dbAddMassHymns,
  dbDeleteMass,
  dbDeleteMassHymns,
  dbDuplicateMass,
  dbDuplicateMassHymns,
  dbGetMassData,
  dbUpdateMass,
  type Mass,
  type MassParams,
} from "../db/masses";
import {
  s3DeleteFile,
  s3DownloadFile,
  s3GetSignedUrl,
  s3UploadFile,
} from "../s3";
import { deleteFilesInDirectory } from "../utils";

export const updateMass = async (
  massId: string,
  massParams: MassParams
): Promise<Mass> => {
  // Update masses table
  try {
    await dbBeginTransaction();
    const newMass = await dbUpdateMass(massId, massParams);
    await dbDeleteMassHymns(massId);
    await dbAddMassHymns(massId, massParams);
    await dbCommit();

    await createMassPdf(massParams);
    await saveMassPdfToS3(massId, massParams);
    return newMass;
  } catch (err) {
    await dbRollback();
    throw err;
  }
};

const streamToFile = async (
  inputStream: Readable,
  filePath: string
): Promise<void> => {
  await new Promise((resolve, reject) => {
    const fileWriteStream = fs.createWriteStream(filePath);
    inputStream.pipe(fileWriteStream).on("finish", resolve).on("error", reject);
  });
};

// Create merged PDF file
export const createMassPdf = async (massParams: MassParams): Promise<void> => {
  const hymns = massParams.hymns;

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
    const hymnType = hymnTypes[hymn.hymnTypeId]?.name ?? "";
    page.drawText(`${index + 1}. ${hymnType}:`, {
      x: 50,
      y: height - 145 - index * 1.5 * fontSize,
      size: fontSize,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(hymn.name, {
      x: width / 2 - 50,
      y: height - 145 - index * 1.5 * fontSize,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
  });

  // Create downloads folder if it doesn't exist
  const downloadsFolder = "downloads/";
  if (!fs.existsSync(downloadsFolder)) {
    fs.mkdirSync(downloadsFolder);
  }

  let hymnIndex = 1;
  for (const hymn of hymns) {
    const fileIds = hymn.fileIds;
    for (const fileId of fileIds) {
      // Save file locally
      const filePath = `${downloadsFolder}${fileId}.pdf`;
      const file = await s3DownloadFile("music", fileId);
      await streamToFile(file as Readable, filePath);

      // Add file to merged pdf
      const document = await PDFDocument.load(fs.readFileSync(filePath));
      const copiedPages = await mergedPdf.copyPages(
        document,
        document.getPageIndices()
      );
      copiedPages.forEach((page) => {
        let { width, height } = page.getSize();
        const rotationAngle = page.getRotation().angle;

        // Work out the actual orientation of the document
        if (
          rotationAngle === 90 ||
          rotationAngle === -90 ||
          rotationAngle === 270
        ) {
          [width, height] = [height, width];
        }

        // Rotate landscape pages
        if (width > height) {
          page.setRotation(degrees(rotationAngle - 90));
          // Swap width and height
          [width, height] = [height, width];
        }

        page.drawText(`${hymnIndex}`, {
          x: width - 40,
          y: height - 35,
          size: 16,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        mergedPdf.addPage(page);
      });
    }
    hymnIndex++;
  }

  fs.writeFileSync(`downloads/${massParams.name}.pdf`, await mergedPdf.save());
};

// Save mass file to S3
export const saveMassPdfToS3 = async (
  massId: string,
  massParams: MassParams
): Promise<void> => {
  const fileId = (await dbGetMassData(massId)).fileId ?? uuidv4();

  try {
    await dbBeginTransaction();
    await dbAddMassFileInfo(fileId, massId);
    await s3UploadFile(`downloads/${massParams.name}.pdf`, fileId, "masses");
    await dbCommit();
    await deleteFilesInDirectory("downloads/");
  } catch (err) {
    await dbRollback();
    throw err;
  }
};

export const deleteMass = async (massId: string): Promise<void> => {
  try {
    await dbBeginTransaction();
    const fileId = (await dbGetMassData(massId)).fileId;
    await dbDeleteMassHymns(massId);
    await dbDeleteMass(massId);
    if (fileId !== null) {
      await s3DeleteFile(fileId, "masses");
    }
    await dbCommit();
  } catch (err) {
    await dbRollback();
    throw err;
  }
};

export const duplicateMass = async (massId: string): Promise<Mass> => {
  try {
    await dbBeginTransaction();
    const newMass = await dbDuplicateMass(massId);
    await dbDuplicateMassHymns(massId);
    await dbCommit();
    return newMass;
  } catch (err) {
    await dbRollback();
    throw err;
  }
};

export const getMassFile = async (massId: string): Promise<string | null> => {
  const mass = await dbGetMassData(massId);
  if (mass.fileId !== null) {
    const url = await s3GetSignedUrl("masses", mass.fileId, mass.name);
    return url;
  }
  return null;
};
