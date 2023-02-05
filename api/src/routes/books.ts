import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { dbGetBooks } from "../db/books";
export const booksRouter = express.Router();

// Get list of hymns that match search query
booksRouter.get("/", (_req: Request, res: Response, next: NextFunction) => {
  dbGetBooks()
    .then((books) => res.status(200).json(books))
    .catch((err) => {
      next(err);
    });
});
