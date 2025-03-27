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