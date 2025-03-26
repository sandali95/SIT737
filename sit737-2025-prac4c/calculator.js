const express = require("express");
const app = express();
const winston = require("winston");
const fs = require("fs");


// Enhanced Winston logger configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.json()
  ),
  defaultMeta: { service: "advanced-calculator" },
  transports: [
    new winston.transports.File({ 
      filename: "logs/error.log", 
      level: "error"
    }),
    new winston.transports.File({ 
      filename: "logs/combined.log"
    })
  ]
});

// Console logging in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Basic Arithmetic Operations
const add = (n1, n2) => n1 + n2;
const subtract = (n1, n2) => n1 - n2;
const multiply = (n1, n2) => n1 * n2;
const divide = (n1, n2) => {
  if (n2 === 0) throw new Error("Division by zero");
  return n1 / n2;
};

// Advanced Arithmetic Operations
const exponentiate = (base, exponent) => {
  if (exponent < 0 && base === 0) {
    throw new Error("Undefined result: 0 to negative power");
  }
  return Math.pow(base, exponent);
};

const squareRoot = (number) => {
  if (number < 0) throw new Error("Square root of negative number");
  return Math.sqrt(number);
};

const modulo = (dividend, divisor) => {
  if (divisor === 0) throw new Error("Modulo by zero");
  return dividend % divisor;
};

const factorial = (number) => {
  if (number < 0) throw new Error("Factorial of negative number");
  if (!Number.isInteger(number)) throw new Error("Factorial requires integer");
  
  let result = 1;
  for (let i = 2; i <= number; i++) {
    result *= i;
  }
  return result;
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

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ 
    statusCode: 500,
    error: err.message,
    timestamp: new Date().toISOString()
  });
};

// Basic Arithmetic Endpoints
app.get("/add", (req, res, next) => {
  try {
    const [n1, n2] = validateInputs(req.query.n1, req.query.n2);
    const result = add(n1, n2);
    logger.info(`Addition: ${n1} + ${n2} = ${result}`);
    res.status(200).json({ 
      operation: "add",
      input: { n1, n2 },
      result
    });
  } catch (err) {
    next(err);
  }
});

app.get("/subtract", (req, res, next) => {
  try {
    const [n1, n2] = validateInputs(req.query.n1, req.query.n2);
    const result = subtract(n1, n2);
    logger.info(`Subtraction: ${n1} - ${n2} = ${result}`);
    res.status(200).json({
      operation: "subtract",
      input: { n1, n2 },
      result
    });
  } catch (err) {
    next(err);
  }
});

app.get("/multiply", (req, res, next) => {
  try {
    const [n1, n2] = validateInputs(req.query.n1, req.query.n2);
    const result = multiply(n1, n2);
    logger.info(`Multiplication: ${n1} * ${n2} = ${result}`);
    res.status(200).json({
      operation: "multiply",
      input: { n1, n2 },
      result
    });
  } catch (err) {
    next(err);
  }
});

app.get("/divide", (req, res, next) => {
  try {
    const [n1, n2] = validateInputs(req.query.n1, req.query.n2);
    const result = divide(n1, n2);
    logger.info(`Division: ${n1} / ${n2} = ${result}`);
    res.status(200).json({
      operation: "divide",
      input: { n1, n2 },
      result
    });
  } catch (err) {
    next(err);
  }
});

// Advanced Arithmetic Endpoints
app.get("/power", (req, res, next) => {
  try {
    const [base, exponent] = validateInputs(req.query.base, req.query.exponent);
    const result = exponentiate(base, exponent);
    logger.info(`Exponentiation: ${base}^${exponent} = ${result}`);
    res.status(200).json({
      operation: "exponentiation",
      input: { base, exponent },
      result
    });
  } catch (err) {
    next(err);
  }
});

app.get("/sqrt", (req, res, next) => {
  try {
    const [number] = validateInputs(req.query.number);
    const result = squareRoot(number);
    logger.info(`Square root: √${number} = ${result}`);
    res.status(200).json({
      operation: "square_root",
      input: { number },
      result
    });
  } catch (err) {
    next(err);
  }
});

app.get("/modulo", (req, res, next) => {
  try {
    const [dividend, divisor] = validateInputs(req.query.dividend, req.query.divisor);
    const result = modulo(dividend, divisor);
    logger.info(`Modulo: ${dividend} % ${divisor} = ${result}`);
    res.status(200).json({
      operation: "modulo",
      input: { dividend, divisor },
      result
    });
  } catch (err) {
    next(err);
  }
});

app.get("/factorial", (req, res, next) => {
  try {
    const [number] = validateInputs(req.query.number);
    const result = factorial(number);
    logger.info(`Factorial: ${number}! = ${result}`);
    res.status(200).json({
      operation: "factorial",
      input: { number },
      result
    });
  } catch (err) {
    next(err);
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    error: "Endpoint not found",
    timestamp: new Date().toISOString()
  });
});

// Apply error handling middleware
app.use(errorHandler);

// Server startup
const port = process.env.PORT || 3040;
app.listen(port, () => {
  logger.info(`Advanced Calculator Service running on port ${port}`);
});