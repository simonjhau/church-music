import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { dbGetMostPopularHymns } from "../db/stats";

export const statsRouter = express.Router();

// Get most popular hymns
statsRouter.get(
  "/hymns/most-popular",
  (_req: Request, res: Response, next: NextFunction) => {
    dbGetMostPopularHymns()
      .then((hymnCounts) => {
        res.status(200).json(hymnCounts);
      })
      .catch((err) => {
        next(err);
      });
  }
);
