import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { auth } from "express-oauth2-jwt-bearer";

import { auth0Audience, auth0Domain } from "../config/index";
import { checkDbPoolConnection } from "../db";
import { booksRouter } from "./books";
import { fileTypesRouter } from "./fileTypes";
import { hymnFilesRouter } from "./hymnFiles";
import { hymnsRouter } from "./hymns";
import { hymnTypesRouter } from "./hymnTypes";
import { massesRouter } from "./masses";
import { statsRouter } from "./stats";

export const router = express.Router();

router.get("/status", (_req: Request, res: Response, next: NextFunction) => {
  checkDbPoolConnection()
    .then(() => res.json({ msg: "ok" }))
    .catch((err) => {
      next(err);
    });
});

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: auth0Audience,
  issuerBaseURL: `https://${auth0Domain}`,
});
router.use(checkJwt);

router.use("/books", booksRouter);
router.use("/fileTypes", fileTypesRouter);
router.use("/hymns/:hymnId/files", hymnFilesRouter);
router.use("/hymns", hymnsRouter);
router.use("/hymnTypes", hymnTypesRouter);
router.use("/masses", massesRouter);
router.use("/stats", statsRouter);

router.get("/auth", (_req: Request, res: Response) => {
  res.json({ msg: "authenticated" });
});
