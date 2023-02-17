import express from "express";
import path from "path";

import { port } from "./config/index";
import { router } from "./routes/index";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const appDir = path.join(__dirname, "../..", "app", "dist");
app.use(express.static(appDir));

app.use("/api", router);

app.get("*", (_req, res) => {
  res.sendFile(path.join(appDir, "index.html"));
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on http://localhost:${port}`);
});
