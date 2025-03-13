const express = require("express");
const path = require("path");
const fs = require("fs");
const winston = require("winston");

const app = express();

// Configure Winston Logger
const logger = winston.createLogger({
  level: "info", // Log level (info, warn, error, etc.)
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(), // Logs to console
    new winston.transports.File({ filename: "logs/error.log" }), // Logs to file
  ],
});

app.use(express.static(path.join(__dirname, "public")));
const viewsPath = path.join(__dirname, "views");

// Home Route
app.get("/home", (req, res) => {
  res.sendFile(path.join(viewsPath, "home.html"));
});

// Error Handling Middleware - for global errors
app.use((err, req, res, next) => {
  logger.error(`500 - Server Error: ${err.message}`);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

//Error handling Middleware - for unknown routes
app.use((req, res, next) => {
  logger.warn(`404 - Not Found: ${req.method} ${req.url}`);
  res
    .status(404)
    .json({
      error: "Not Found",
      message: "The requested resource does not exist.",
    });
});



const port = 3040;
app.listen(port, () => {
  console.log("hello i'm listening to port " + port);
});
