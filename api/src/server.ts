import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import checkJwt from "./authz/checkJwt";
import { clientOrigins, serverPort, withAuth } from "./config/env.dev";
import books from "./routes/books";
import fileTypes from "./routes/fileTypes";
import hymnFiles from "./routes/hymnFiles";
import hymns from "./routes/hymns";
import hymnTypes from "./routes/hymnTypes";
import masses from "./routes/masses";
import path from "path";

// Init express
const app: Application = express();

app.use(helmet());

// Cors
app.use(cors({ origin: clientOrigins }));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const frontEndPath = path.join(__dirname, "../../app/build/");
app.use(express.static(frontEndPath));

// Check if use is authenticated
if (withAuth) {
  app.use(checkJwt);
} else {
  console.warn("Warning: Running with authentication disabled");
}

app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
});

// API Routes
app.use("/api/books", books);
app.use("/api/fileTypes", fileTypes);
app.use("/api/hymnTypes", hymnTypes);
app.use("/api/hymns", hymns);
app.use("/api/hymns/:hymnId/files", hymnFiles);
app.use("/api/masses", masses);

app.get("*", async (req, res) => {
  res.sendFile(path.join(frontEndPath, "index.html"));
});

app.listen(serverPort, () =>
  console.log(`Server started on port ${serverPort}`)
);
