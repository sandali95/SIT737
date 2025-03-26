const express = require("express");
const app = express();
const fs = require("fs");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "calc-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
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

const add = (n1, n2) => {
  return n1 + n2;
};

const substract = (n1, n2) => {
  return n1 - n2;
};

const multipication = (n1, n2) => {
  return n1 * n2;
};

const division = (n1, n2) => {
  return n1 / n2;
};

const validateInputs = (input1, input2) => {
  if (input1 === undefined || input2 === undefined) {
    logger.error("One or both parameters are missing");
    throw new Error("Both n1 and n2 parameters are required");
  }

  const n1 = parseFloat(input1);
  const n2 = parseFloat(input2);

  if (isNaN(n1)) {
    logger.error("n1 is incorrectly defined");
    throw new Error("n1 must be a valid number");
  }
  if (isNaN(n2)) {
    logger.error("n2 is incorrectly defined");
    throw new Error("n2 must be a valid number");
  }

  return [n1, n2]; // Return the converted numbers
};


app.get("/add", (req, res) => {
  try {
    const n1 = req.query.n1;
    const n2 = req.query.n2;
    const [num1, num2] = validateInputs(n1, n2);

    logger.info(`Parameters ${num1} and ${num2} received for addition`);
    const result = add(num1, num2);
    res.status(200).json({ statuscocde: 200, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statuscocde: 500, msg: error.toString() });
  }
});

app.get("/substract", (req, res) => {
  try {
    const n1 = req.query.n1;
    const n2 = req.query.n2;
    const [num1, num2] = validateInputs(n1, n2);

    logger.info(`Parameters ${num1} and ${num2} received for substraction`);
    const result = substract(num1, num2);
    res.status(200).json({ statuscocde: 200, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statuscocde: 500, msg: error.toString() });
  }
});

app.get("/multipication", (req, res) => {
  try {
    const n1 = req.query.n1;
    const n2 = req.query.n2;
    const [num1, num2] = validateInputs(n1, n2);

    logger.info(`Parameters ${num1} and ${num2} received for multipication`);
    const result = multipication(num1, num2);
    res.status(200).json({ statuscocde: 200, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statuscocde: 500, msg: error.toString() });
  }
});

app.get("/division", (req, res) => {
  try {
    const n1 = req.query.n1;
    const n2 = req.query.n2;
    const [num1, num2] = validateInputs(n1, n2);
    
    if (num2 === 0) {
      logger.error("Attempt to divide by zero");
      throw new Error("Cannot divide by zero");
    }

    logger.info(`Parameters ${num1} and ${num2} received for division`);
    const result = division(num1, num2);
    res.status(200).json({ statuscocde: 200, data: result });
  } catch (error) {
    logger.error(error.toString());
    res.status(500).json({ statuscocde: 500, msg: error.toString() });
  }
});

const port = 3040;
app.listen(port, () => {
  console.log("hello i'm listening to port " + port);
});
