# 4.2C: Enhanced Functionality for the Calculator Microservice - Calculator API

A simple REST API for basic arithmetic operations built with Express.js and Winston logging.

## Features

- Four basic arithmetic operations: add, subtract, multiply, divide
- Advanced Operations: Exponentiation, Square Root, Modulo, Factorial
- Comprehensive request logging
- Error handling and validation
- JSON responses
- health Check endpoint for system monitoring

## Guide on calculator.js

### API Endpoints
All endpoints accept GET requests with query parameters n1 and n2.

#### 01.Addition

```
GET /add?n1=5&n2=3
```

#### 02.Subtraction

```
GET /substract?n1=10&n2=4
```

#### 03.Multiplication

```
GET /multiply?n1=6&n2=7
```

#### 04.Division

```
GET /divide?n1=20&n2=5
```

#### 05. Exponentiation

```
GET /power?base=2&exponent=3
```

#### 06. Square Root

```
GET /sqrt?number=25
```

#### 07. Modulo

```
GET /modulo?dividend=10&divisor=3
```

#### 08. Factorial

```
GET /factorial?number=5
```

### System Operations

#### 09. Health Check

```
GET /health
```

### Example Response

Success
```
{
  "operation": "add",
  "input": {
    "n1": 5,
    "n2": 3
  },
  "result": 8,
  "timestamp": "2023-11-20T14:30:45.123Z"
}
```

Error
```
{
  "statusCode": 400,
  "error": "n1 must be a valid number",
  "timestamp": "2023-11-20T14:31:22.456Z",
  "path": "/add"
}
```

```

404 error
{
    "statusCode": 404,
    "error": "Endpoint not found",
    "timestamp": "2025-03-26T12:41:22.108Z"
}
```

### Logging
The application logs to two files:

logs/error.log - Contains only error messages

logs/combined.log - Contains all log messages

In development mode, logs also appear in the console.

### Error Handling 

* Input validation is done through validateInput() method which returns the parsed float values for the input parameters.
  It will throw a new Error which proper error message for any validation failures.

* Error handling middleware errorHandler() catches and processes all errors in the API, logging them with key details while sending a clean, structured error response to clients. It ensures consistent error reporting with below format.

```
{
  "statusCode": 500,
  "error": "Division by zero",
  "timestamp": "2023-11-21T09:45:22.123Z",
  "path": "/divide"
}
```

* All requests to undefined routes are catched by the middleware defined in line 240 and returns a clean JSON error response with a 404 status code. 
```
{
  "statusCode": 404,
  "error": "Endpoint not found",
  "timestamp": "2023-11-22T08:30:45.000Z"
}
```




#### File Structure

calculator-api/<br>
|--- calculator.js               # Main application file <br>
|--- logs/                # Logs directory (auto-created)<br>
│   ├── error.log        <br>
│   └── combined.log     <br>
├── package.json<br>
└── node_modules/<br>

