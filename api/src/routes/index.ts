import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { checkDbPoolConnection } from "../db";
import { booksRouter } from "./books";
import { fileTypesRouter } from "./fileTypes";
import { hymnFilesRouter } from "./hymnFiles";
import { hymnsRouter } from "./hymns";
import { hymnTypesRouter } from "./hymnTypes";
import { massesRouter } from "./masses";

export const router = express.Router();

router.use("/books", booksRouter);
router.use("/fileTypes", fileTypesRouter);
router.use("/hymns/:hymnId/files", hymnFilesRouter);
router.use("/hymns", hymnsRouter);
router.use("/hymnTypes", hymnTypesRouter);
router.use("/masses", massesRouter);

router.get("/status", (_req: Request, res: Response, next: NextFunction) => {
  checkDbPoolConnection()
    .then(() => res.status(200))
    .catch((err) => {
      next(err);
    });
});

router.get("/auth", (_req: Request, res: Response) => {
  res.json({ msg: "authenticated" });
});
