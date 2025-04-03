# 6.1P: Creating a Kubernetes Cluster for a containerized application

This is a simple todo application with only one service demonstrating kubernetes cluster usage.
This is a continuation of 5.1p task. The image built from the task has been used in the deployment.

### Docker
The `todo-app` is containerized using Docker. Below are the key details:
- **Docker Image**: `sandali95/todo-app:1.1`
- **Dockerfile**: A `Dockerfile` is used to build the image for the application.
- **Build Command**:
  ```bash
  docker build -t sandali95/todo-app:1.1 .
  ```
- **Push Command**:
  ```bash
  docker push sandali95/todo-app:1.1
  ```

#### Instructions:
1. Ensure Docker is installed and running on your system.
2. Navigate to the project directory containing the `Dockerfile`.
3. Build the Docker image using the `docker build` command.
4. Push the image to your Docker registry using the `docker push` command.

### Deployment Configuration
The `todo-app` is deployed using a Kubernetes Deployment resource. Below are the key details:
- **API Version**: `apps/v1`
- **Kind**: `Deployment`
- **Name**: `todo-app`
- **Replicas**: `1`
- **Container Image**: `sandali95/todo-app:1.1`
- **Container Port**: `80`
- **Environment Variable**: `PORT=3040`

### Service Configuration
The `todo-app` is exposed using a Kubernetes Service resource. Below are the key details:
- **API Version**: `v1`
- **Kind**: `Service`
- **Name**: `todo-app-service`
- **Type**: `NodePort`
- **Port**: `80`
- **Target Port**: `3040`
- **Node Port**: `30000`

### How to Apply the Configuration
1. Navigate to the `scripts` directory:
   ```bash
   cd scripts
   ```
2. Apply the deployment and service configuration:
   ```bash
   kubectl apply -f deployment-service.yaml
   ```
3. Verify the deployment:
   ```bash
   kubectl get deployments
   ```
4. Verify the service:
   ```bash
   kubectl get services
   ```

### Accessing the Application
- The application is accessible on `NodeIP:30000`. Replace `NodeIP` with the IP address of your Kubernetes node. Since we used docker desktop, this would be localhost.


More detailed comments are provided as code comments of deployment-service.yaml file.
