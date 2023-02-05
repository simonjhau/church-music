import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { dbGetFileTypes } from "../db/fileTypes";

export const fileTypesRouter = express.Router();

// Get list of hymns that match search query
fileTypesRouter.get("/", (_req: Request, res: Response, next: NextFunction) => {
  dbGetFileTypes()
    .then((fileTypes) => res.status(200).json(fileTypes))
    .catch((err) => {
      next(err);
    });
});
