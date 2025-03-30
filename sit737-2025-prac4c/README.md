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
<img width="500" alt="Screenshot 2025-03-31 at 09 28 09" src="https://github.com/user-attachments/assets/c7dc6cc9-a971-4b3a-b454-171915c82892" />


#### 02.Subtraction

```
GET /substract?n1=10&n2=4
```
<img width="500" alt="Screenshot 2025-03-31 at 09 32 36" src="https://github.com/user-attachments/assets/e5b7824d-dbbd-475a-9275-926fe9427620" />


#### 03.Multiplication

```
GET /multiply?n1=6&n2=7
```
<img width="500" alt="Screenshot 2025-03-31 at 09 48 43" src="https://github.com/user-attachments/assets/e843aa0c-843d-4c59-b7d0-f011915fdfdf" />


#### 04.Division

```
GET /divide?n1=20&n2=5
```
<img width="500" alt="Screenshot 2025-03-31 at 09 49 27" src="https://github.com/user-attachments/assets/3b2d3a60-83bd-48aa-8c9d-4c8b91ddd619" />


#### 05. Exponentiation

```
GET /power?base=2&exponent=3
```
<img width="500" alt="Screenshot 2025-03-31 at 09 49 51" src="https://github.com/user-attachments/assets/ad436cbe-7e0f-48e2-9f9c-2fd25a699b7b" />


#### 06. Square Root

```
GET /sqrt?number=25
```
<img width="500" alt="Screenshot 2025-03-31 at 09 53 15" src="https://github.com/user-attachments/assets/82cfdccd-9435-4457-b3c6-50f28238c583" />


#### 07. Modulo

```
GET /modulo?dividend=10&divisor=3
```
<img width="500" alt="Screenshot 2025-03-31 at 09 53 35" src="https://github.com/user-attachments/assets/5411db3c-ad88-4d96-b368-32a186c8cba7" />


#### 08. Factorial

```
GET /factorial?number=5
```
<img width="500" alt="Screenshot 2025-03-31 at 09 54 19" src="https://github.com/user-attachments/assets/2fda041d-80bc-4989-b484-242cf99d328c" />


### System Operations

#### 09. Health Check

```
GET /health
```
<img width="500" alt="Screenshot 2025-03-31 at 09 57 18" src="https://github.com/user-attachments/assets/3be950d0-5c62-42fc-a4b7-f64562b54350" />


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
*The application logs to two files:
  * logs/error.log - Contains only error messages
    <img width="1358" alt="Screenshot 2025-03-31 at 09 57 55" src="https://github.com/user-attachments/assets/498b2387-f81e-413d-97d2-68f698aff38f" />


  * logs/combined.log - Contains all log messages
    <img width="1369" alt="Screenshot 2025-03-31 at 09 58 03" src="https://github.com/user-attachments/assets/e71b1d9d-dcfd-45c1-bc20-562206eb1581" />


In development mode, logs also appear in the console.

<img width="500" alt="Screenshot 2025-03-31 at 09 58 21" src="https://github.com/user-attachments/assets/6fc6448f-a98b-46b8-a3ee-df4ef22a0e26" />


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


### File Structure

calculator-api/<br>
|--- calculator.js               # Main application file <br>
|--- logs/                # Logs directory (auto-created)<br>
│   ├── error.log        <br>
│   └── combined.log     <br>
├── package.json<br>
└── node_modules/<br>

