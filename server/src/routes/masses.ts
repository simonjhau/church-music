import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z } from "zod";

import {
  dbAddMass,
  dbGetAllMasses,
  dbGetMassData,
  dbGetMassesByQuery,
  dbGetMassHymns,
  MassParamsSchema,
  NewMassParamsSchema,
} from "../db/masses";
import {
  deleteMass,
  duplicateMass,
  getMassFile,
  updateMass,
} from "../models/masses";
import { parseData } from "../utils";

export const massesRouter = express.Router();

// Get list of hymns that match search query
massesRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  const query = req.query.q;
  if (typeof query === "string") {
    const validQueryString = parseData(
      z.string(),
      query,
      "Problem with get masses query param"
    );
    dbGetMassesByQuery(validQueryString)
      .then((masses) => res.status(200).json(masses))
      .catch((err) => {
        next(err);
      });
  } else {
    dbGetAllMasses()
      .then((masses) => res.status(200).json(masses))
      .catch((err) => {
        next(err);
      });
  }
});

const MassIdReqParamsSchema = z.object({
  id: z.string(),
});

// Get mass data for given mass id
massesRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  const validReqParams = parseData(
    MassIdReqParamsSchema,
    req.params,
    "Problem with get mass data request params"
  );
  const massId = validReqParams.id;
  dbGetMassData(massId)
    .then((mass) => {
      res.status(200).json(mass);
    })
    .catch((err) => {
      next(err);
    });
});

// Get hymns/files for given mass
massesRouter.get(
  "/:id/hymns",
  (req: Request, res: Response, next: NextFunction) => {
    const validReqParams = parseData(
      MassIdReqParamsSchema,
      req.params,
      "Problem with get hymns/files for mass request params"
    );
    const massId = validReqParams.id;
    dbGetMassHymns(massId)
      .then((hymns) => {
        res.status(200).json(hymns);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// Get mass file given mass id
massesRouter.get(
  "/:id/file",
  (req: Request, res: Response, next: NextFunction) => {
    const validReqParams = parseData(
      MassIdReqParamsSchema,
      req.params,
      "Problem with get mass file request params"
    );

    const massId = validReqParams.id;
    getMassFile(massId)
      .then((url) => {
        res.status(200).json(url);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// Add mass record
massesRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  const validMassParams = parseData(
    NewMassParamsSchema,
    req.body,
    "Problem with add mass request body"
  );
  dbAddMass(validMassParams)
    .then((newMass) => {
      res.status(201).json(newMass);
    })
    .catch((err) => {
      next(err);
    });
});

// Duplicate mass record
massesRouter.post(
  "/:id/duplicate",
  (req: Request, res: Response, next: NextFunction) => {
    const validReqParams = parseData(
      MassIdReqParamsSchema,
      req.params,
      "Problem with duplicate mass file request params"
    );

    const oldMassId = validReqParams.id;
    duplicateMass(oldMassId)
      .then((newMass) => {
        res.status(200).json(newMass);
      })
      .catch((err) => {
        next(err);
      });
  }
);

// Edit mass
massesRouter.put("/:id", (req: Request, res: Response, next: NextFunction) => {
  const validReqParams = parseData(
    MassIdReqParamsSchema,
    req.params,
    "Problem with edit mass file request params"
  );
  const validMassParams = parseData(
    MassParamsSchema,
    req.body,
    "Problem with edit mass file request params"
  );

  const massId = validReqParams.id;
  updateMass(massId, validMassParams)
    .then((updatedMass) => {
      res.status(200).json(updatedMass);
    })
    .catch((err) => {
      next(err);
    });
});

// Delete mass given ID
massesRouter.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const validReqParams = parseData(
      MassIdReqParamsSchema,
      req.params,
      "Problem with edit mass file request params"
    );

    const massId = validReqParams.id;
    deleteMass(massId)
      .then(() => {
        res.status(200).send(`Mass successfully deleted from db`);
      })
      .catch((err) => {
        next(err);
      });
  }
);
