const express = require("express");
const path = require("path");
const fs = require("fs");
const winston = require("winston");

const app = express();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "todo-service" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

app.use(express.static(path.join(__dirname, "public")));
const viewsPath = path.join(__dirname, "views");

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`500 - Server Error: ${err.message}`);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

app.use((req, res, next) => {
  logger.warn(`404 - Not Found: ${req.method} ${req.url}`);
  res
    .status(404)
    .json({
      error: "Not Found",
      message: "The requested resource does not exist.",
    });
});

// Home Route
app.get("/home", (req, res) => {
  res.sendFile(path.join(viewsPath, "home.html"));
});

const port = 3040;
app.listen(port, () => {
  console.log("hello i'm listening to port " + port);
});
