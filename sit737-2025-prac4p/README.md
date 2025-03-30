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
<img width="500" alt="Screenshot 2025-03-31 at 09 28 09" src="https://github.com/user-attachments/assets/c7dc6cc9-a971-4b3a-b454-171915c82892" />


#### 02.Subtraction

```
GET /substract?n1=10&n2=4
```
<img width="500" alt="Screenshot 2025-03-31 at 09 32 36" src="https://github.com/user-attachments/assets/e5b7824d-dbbd-475a-9275-926fe9427620" />


#### 03.Multiplication

```
GET /multipication?n1=6&n2=7
```
<img width="500" alt="Screenshot 2025-03-31 at 09 33 04" src="https://github.com/user-attachments/assets/93003100-5991-4e83-92cb-5b8d678f3258" />


#### 04.Division

```
GET /division?n1=20&n2=5
```
<img width="500" alt="Screenshot 2025-03-31 at 09 34 08" src="https://github.com/user-attachments/assets/0d3c7325-04ab-4738-9c73-cc3fdd94c04d" />


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

<img width="500" alt="Screenshot 2025-03-31 at 09 35 57" src="https://github.com/user-attachments/assets/ecca93ef-dc2c-4027-a66a-dd1d42e59e7d" />

logs/combined.log - Contains all log messages

<img width="500" alt="Screenshot 2025-03-31 at 09 36 03" src="https://github.com/user-attachments/assets/82a880c6-3880-4b4d-b975-0025776fe6bc" />


In development mode, logs also appear in the console.

<img width="500" alt="Screenshot 2025-03-31 at 09 38 12" src="https://github.com/user-attachments/assets/fb813a1a-7cf5-4de4-b47e-22b60cf92ff8" />


#### File Structure

calculator-api/<br>
|--- calculator.js               # Main application file <br>
|--- logs/                # Logs directory (auto-created)<br>
│   ├── error.log        <br>
│   └── combined.log     <br>
├── package.json<br>
└── node_modules/<br>

