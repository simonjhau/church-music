import express from "express";

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
