import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z } from "zod";

import {
  dbGetFileData,
  dbGetFileDataNames,
  dbGetListOfFiles,
  dbUpdateFile,
  UploadedFileParamsSchema,
} from "../db/hymnFiles";
import { deleteFile, multerUpload, uploadFile } from "../models/hymnFiles";
import { s3GetSignedUrl } from "../s3";
import { parseData } from "../utils";

export const hymnFilesRouter = express.Router({ mergeParams: true });

// Get list of files associated with a hymn
const GetHymnFilesRequestSchema = z
  .object({
    hymnId: z.string(),
  })
  .strict();
hymnFilesRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  const validReqParams = parseData(
    GetHymnFilesRequestSchema,
    req.params,
    "Problem with get hymn files request params"
  );

  const hymnId = validReqParams.hymnId;
  dbGetListOfFiles(hymnId)
    .then((files) => {
      res.status(200).json(files);
    })
    .catch((err) => {
      next(err);
    });
});

// Get file data given file ID
const GetFileDataRequestSchema = z
  .object({
    hymnId: z.string(),
    fileId: z.string(),
  })
  .strict();
hymnFilesRouter.get(
  "/:fileId",
  (req: Request, res: Response, next: NextFunction) => {
    const validReqParams = parseData(
      GetFileDataRequestSchema,
      req.params,
      "Problem with get file data request params"
    );

    const fileId = validReqParams.fileId;
    dbGetFileData(fileId)
      .then((fileData) => {
        res.status(200).json(fileData);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// Get hymn file given file ID
const GetFileRequestSchema = z
  .object({
    hymnId: z.string(),
    id: z.string(),
  })
  .strict();
hymnFilesRouter.get(
  "/:id/file",
  (req: Request, res: Response, next: NextFunction) => {
    const validReqParams = parseData(
      GetFileRequestSchema,
      req.params,
      "Problem with get file request params"
    );
    const fileId = validReqParams.id;
    getHymnFileName(fileId)
      .then(async (fileName) => {
        const url = await s3GetSignedUrl("music", fileId, fileName);
        res.status(200).json(url);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// Create file name
const getHymnFileName = async (fileId: string): Promise<string> => {
  const fileDataNames = await dbGetFileDataNames(fileId);
  const fileName =
    `${fileDataNames.hymnName} ${fileDataNames.fileType}` +
    (fileDataNames.bookCode !== "Other" ? ` ${fileDataNames.bookCode}` : "") +
    (fileDataNames.hymnNum ? String(fileDataNames.hymnNum) : "") +
    (fileDataNames.comment === "" ? ` ${fileDataNames.comment}` : "");
  return fileName;
};

// Upload a file
const AddFileReqParamsSchema = z.object({
  hymnId: z.string(),
});
hymnFilesRouter.post(
  "/",
  multerUpload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      res.status(400).send("Ensure pdf file is attached");
      return;
    }

    const validReqParams = parseData(
      AddFileReqParamsSchema,
      req.params,
      "Problem with delete file request params"
    );
    const validFileParams = parseData(
      UploadedFileParamsSchema,
      req.body,
      "Problem with upload file request body"
    );
    if (validFileParams.bookId === 4 && validFileParams.hymnNum === undefined) {
      res.status(400).send(`Missing parameter 'hymnNum'`);
      return;
    }

    const hymnId = validReqParams.hymnId;

    uploadFile(validFileParams, hymnId, req.file)
      .then((file) => {
        res.status(201).json(file);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// Delete file
const DeleteFileReqParamsSchema = z.object({
  hymnId: z.string(),
  fileId: z.string(),
});
hymnFilesRouter.delete(
  "/:fileId",
  (req: Request, res: Response, next: NextFunction) => {
    const validReqParams = parseData(
      DeleteFileReqParamsSchema,
      req.params,
      "Problem with delete file request params"
    );

    const hymnId = validReqParams.hymnId;
    const fileId = validReqParams.fileId;
    deleteFile(hymnId, fileId)
      .then(() => res.status(200).send("File deleted successfully"))
      .catch((err) => {
        next(err);
      });
  }
);

// Update file given file ID
const UpdateFileReqParamsSchema = z.object({
  hymnId: z.string(),
  fileId: z.string(),
});
hymnFilesRouter.put(
  "/:fileId",
  (req: Request, res: Response, next: NextFunction) => {
    const validReqParams = parseData(
      UpdateFileReqParamsSchema,
      req.params,
      "Problem with update file request params"
    );

    const validFileData = parseData(
      UploadedFileParamsSchema,
      req.body,
      "Problem with update file data body"
    );

    const hymnId = validReqParams.hymnId;
    const fileId = validReqParams.fileId;
    dbUpdateFile(hymnId, fileId, validFileData)
      .then(() => res.status(200).send("File updated successfully"))
      .catch((err) => {
        next(err);
      });
  }
);
