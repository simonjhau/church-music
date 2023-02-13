import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { dbGetHymnTypes } from "../db/hymnTypes";

export const hymnTypesRouter = express.Router();

// Get list of hymns that match search query
hymnTypesRouter.get("/", (_req: Request, res: Response, next: NextFunction) => {
  dbGetHymnTypes()
    .then((hymnTypes) => res.status(200).json(hymnTypes))
    .catch((err) => {
      next(err);
    });
});
