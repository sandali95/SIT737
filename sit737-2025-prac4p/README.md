# 4.1P: Building a simple calculator microservice - Calculator API

A simple REST API for basic arithmetic operations built with Express.js and Winston logging.

## Features

- Four basic arithmetic operations: add, subtract, multiply, divide
- Comprehensive request logging
- Error handling and validation
- JSON responses

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
GET /multipication?n1=6&n2=7
```

#### 04.Division

GET /division?n1=20&n2=5

### Example Response

Success
```
{
  "statuscocde": 200,
  "data": 8
}
```

Error
```
{
  "statuscocde": 500,
  "msg": "Error: n1 incorrectly defined"
}
```

### Logging
The application logs to two files:

logs/error.log - Contains only error messages

logs/combined.log - Contains all log messages

In development mode, logs also appear in the console.

#### File Structure
calculator-api/<br>
|--- calculator.js               # Main application file <br>
|--- logs/                # Logs directory (auto-created)<br>
│   ├── error.log        <br>
│   └── combined.log     <br>
├── package.json<br>
└── node_modules/<br>

