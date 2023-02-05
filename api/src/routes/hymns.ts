import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import {
  dbAddHymn,
  dbDeleteHymn,
  dbGetHymnById,
  dbGetHymns,
  dbUpdateHymn,
} from "../db/hymns";
export const hymnsRouter = express.Router();

// Get list of hymns that match search query
const GetHymnsRequestSchema = z
  .object({
    q: z.string(),
  })
  .strict();
hymnsRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  const result = GetHymnsRequestSchema.safeParse(req.query);
  if (!result.success) {
    throw new Error(
      `Problem with get hymns request query: \n ${
        fromZodError(result.error).message
      }`
    );
  }

  const query = result.data.q;
  dbGetHymns(query)
    .then((hymns) => res.status(200).json(hymns))
    .catch((err) => {
      next(err);
    });
});

// Get hymn data for requested hymn ID
const HymnByIdRequestSchema = z
  .object({
    id: z.string(),
  })
  .strict();
hymnsRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  const result = HymnByIdRequestSchema.safeParse(req.params);
  if (!result.success) {
    throw new Error(
      `Problem with get hymn by ID request parameters: \n ${
        fromZodError(result.error).message
      }`
    );
  }

  const hymnId = result.data.id;
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
  const result = AddHymnRequestSchema.safeParse(req.body);
  if (!result.success) {
    throw new Error(
      `Problem with add hymn request body: \n ${
        fromZodError(result.error).message
      }`
    );
  }

  const hymnName = result.data.name;
  dbAddHymn(hymnName)
    .then((newHymn) => {
      res.location(`/hymns/${newHymn.id}`);
      res
        .status(201)
        .send(
          `Hymn "${newHymn.name}" (${newHymn.id}) successfully added to database`
        );
    })
    .catch((err) => {
      next(err);
    });
});

// Delete hymn
hymnsRouter.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const result = HymnByIdRequestSchema.safeParse(req.params);
    if (!result.success) {
      throw new Error(
        `Problem with delete hymn request parameters: \n ${
          fromZodError(result.error).message
        }`
      );
    }

    const hymnId = result.data.id;
    dbDeleteHymn(hymnId)
      .then(() => res.status(200).send(`Hymn ${hymnId} deleted successfully`))
      .catch((err) => {
        next(err);
      });
  }
);

// Update hymn
const UpdateHymnRequestParamsSchema = z
  .object({
    id: z.string(),
  })
  .strict();
const UpdateHymnRequestBodySchema = z
  .object({
    name: z.string(),
    lyrics: z.string().optional().nullable(),
  })
  .strict();
hymnsRouter.put("/:id", (req: Request, res: Response, next: NextFunction) => {
  const paramsResult = UpdateHymnRequestParamsSchema.safeParse(req.params);
  if (!paramsResult.success) {
    throw new Error(
      `Problem with update hymn request params: \n ${
        fromZodError(paramsResult.error).message
      }`
    );
  }

  const bodyResult = UpdateHymnRequestBodySchema.safeParse(req.body);
  if (!bodyResult.success) {
    throw new Error(
      `Problem with update hymn request body: \n ${
        fromZodError(bodyResult.error).message
      }`
    );
  }

  const hymnId = paramsResult.data.id;
  const hymnName = bodyResult.data.name;
  const hymnLyrics = bodyResult.data.lyrics;

  dbUpdateHymn(hymnId, hymnName, hymnLyrics)
    .then((hymn) => {
      res.location(`/hymns/${hymnId}`);
      res.status(200).json({ message: "Hymn saved sucessfully", hymn });
    })
    .catch((err) => {
      next(err);
    });
});
