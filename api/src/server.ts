import express from "express";
import path from "path";

const app = express();

const port = process.env.PORT ?? 9000;

const appDir = path.join(__dirname, "../..", "app", "dist");
app.use(express.static(appDir));

app.get("/api/crash", () => {
  throw new Error("crash");
});

app.get("/api", (_req, res) => {
  res.send("Church Music");
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(appDir, "index.html"));
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${port}`);
});
