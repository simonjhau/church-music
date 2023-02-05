import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import { dbGetListOfFiles } from "../db/hymnFiles";
export const hymnFilesRouter = express.Router({ mergeParams: true });

// Get list of files associated with a hymn
const GetHymnFilesRequestSchema = z
  .object({
    hymnId: z.string(),
  })
  .strict();
hymnFilesRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  const result = GetHymnFilesRequestSchema.safeParse(req.params);
  if (!result.success) {
    throw new Error(
      `Problem with get hymn files request params: \n ${
        fromZodError(result.error).message
      }`
    );
  }

  const hymnId = result.data.hymnId;
  dbGetListOfFiles(hymnId)
    .then((files) => {
      res.status(200).json(files);
    })
    .catch((err) => {
      next(err);
    });
});
