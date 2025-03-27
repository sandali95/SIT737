# 5.1P: Containerisation of a simple web application using Docker

This is a simple todo application with only one service demonstrating docker and docker compose usage.

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/todo-app.git
   cd todo-app

2.  **Build and Run with Docker**
    ```bash
    docker compose up -d --build

    Access the web app in http://localhost:3000/home

## Step by Step Guide

### docker file
```
# Use the official Node.js image from the Docker Hub
FROM node:16
 
# Set the working directory inside the container
WORKDIR /app
 
# Copy the package.json and package-lock.json files
COPY package*.json ./
 
# Install the dependencies
RUN npm install
 
# Copy the rest of the application files
COPY . .

# Install curl for health checks
RUN apt-get update && apt-get install -y curl
 
 
# Define the command to run your app
CMD ["node", "index.js"]
```

### docker compose file

```
version: '3'  # Uses Docker Compose schema version 3

services:
  todo-app:
    # Basic container configuration
    image: todo-app  # Uses the built image named 'todo-app'
    build: 
      context: .     # Builds from the current directory
      dockerfile: Dockerfile  # Uses the specified Dockerfile
    container_name: todo-app  # Assigns a fixed name to the container
    
    # Network configuration
    ports:
      - "3000:80"  # Maps host port 3000 to container port 80
                    # Access app via http://localhost:3000
    
    # Environment variables
    environment:
      - PORT=80  # Sets the internal application port to 80
                 # as the app use process.env.PORT.
    
    # Container lifecycle management
    restart: unless-stopped  
      # Auto-restart policy:
      #   'unless-stopped' = Always restart unless manually stopped
      # Alternatives: 'no', 'always', 'on-failure'
    
    # Health monitoring configuration
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]  
        # Health check command:
        # Uses curl to test if /health endpoint returns HTTP 200
        # -f flag = fail silently on server errors
      
      interval: 60s     # Check every 60 seconds 
      timeout: 10s      # Maximum wait time for response
      retries: 3        # Number of consecutive failures before marking as unhealthy
      start_period: 10s # Initial delay before first health check
 ```     

Create an .env file inorder to change the value for process.env.PORT. The default value for this will be 80.
