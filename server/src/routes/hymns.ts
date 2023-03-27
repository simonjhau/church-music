import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z } from "zod";

import {
  dbAddHymn,
  dbDeleteHymn,
  dbGetHymnById,
  dbGetHymns,
  dbUpdateHymn,
} from "../db/hymns";
import { parseData } from "../utils";

export const hymnsRouter = express.Router();

// Get list of hymns that match search query
const GetHymnsRequestSchema = z.object({
  q: z.string(),
});
hymnsRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  const validReqParams = parseData(
    GetHymnsRequestSchema,
    req.query,
    "Problem with get hymns request query"
  );

  const query = validReqParams.q;
  dbGetHymns(query)
    .then((hymns) => res.status(200).json(hymns))
    .catch((err) => {
      next(err);
    });
});

// Get hymn data for requested hymn ID
hymnsRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  const hymnId = req.params.id;
  if (!hymnId) {
    res.sendStatus(400);
    return;
  }

  dbGetHymnById(hymnId)
    .then((hymn) => res.status(200).json(hymn))
    .catch((err) => {
      next(err);
    });
});

// Add new hymn
const AddHymnRequestSchema = z
  .object({
    name: z.string(),
  })
  .strict();
hymnsRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  const validReqBody = parseData(
    AddHymnRequestSchema,
    req.body,
    "Problem with add hymn request body"
  );

  const hymnName = validReqBody.name;
  dbAddHymn(hymnName)
    .then((newHymn) => {
      res.location(`api/hymns/${newHymn.id}`);
      res.status(201).json(newHymn);
    })
    .catch((err) => {
      next(err);
    });
});

// Delete hymn
hymnsRouter.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const hymnId = req.params.id;
    if (!hymnId) {
      res.sendStatus(400);
      return;
    }

    dbDeleteHymn(hymnId)
      .then(() => res.status(200).send(`Hymn ${hymnId} deleted successfully`))
      .catch((err) => {
        next(err);
      });
  }
);

// Update hymn
const UpdateHymnRequestBodySchema = z
  .object({
    name: z.string(),
    lyrics: z.string().optional().nullable(),
  })
  .strict();
hymnsRouter.put("/:id", (req: Request, res: Response, next: NextFunction) => {
  const hymnId = req.body.id;
  if (!hymnId) {
    res.sendStatus(400);
    return;
  }
  const validReqBody = parseData(
    UpdateHymnRequestBodySchema,
    req.body,
    "Problem with update hymn request body"
  );
  const hymnName = validReqBody.name;
  const hymnLyrics = validReqBody.lyrics;

  dbUpdateHymn(hymnId, hymnName, hymnLyrics)
    .then((hymn) => {
      res.status(200).json({ hymn });
    })
    .catch((err) => {
      next(err);
    });
});
