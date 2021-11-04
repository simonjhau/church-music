const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require("./middleware/logger");

const app = express();

// Cors
app.use(cors());

// Body parser middleware
app.use(express.json());

// Game API Routes
app.use("/api/songs", require("./api/songs"));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
