import express from "express";

import { booksRouter } from "./books";
import { fileTypesRouter } from "./fileTypes";
import { hymnsRouter } from "./hymns";

export const router = express.Router();

router.use("/books", booksRouter);
router.use("/fileTypes", fileTypesRouter);
router.use("/hymns", hymnsRouter);
