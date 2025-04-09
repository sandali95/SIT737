# 6.2C: Interacting with Kubernetes

This is a simple todo application with only one service demonstrating kubernetes cluster usage.
This is a continuation of 6.1p task. The image built from the task has been used in the deployment with a minor version upgrade for the changes.

### Docker
The `todo-app` is containerized using Docker. Below are the key details:
- **Docker Image**: `sandali95/todo-app:1.2`
- **Dockerfile**: A `Dockerfile` is used to build the image for the application.
- **Build Command**:
  ```bash
  docker build -t sandali95/todo-app:1.2 .
  ```
- **Push Command**:
  ```bash
  docker push sandali95/todo-app:1.2
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
- **Container Image**: `sandali95/todo-app:1.2`
- **Container Port**: `80`
- **Environment Variable**: `PORT=3040`

### Service Configuration
The `todo-app` is exposed using a Kubernetes Service resource. Below are the key details:
- **API Version**: `v1`
- **Kind**: `Service`
- **Name**: `todo-app-service`
- **Type**: `CluserIP`
- **Port**: `80`
- **Target Port**: `3040`

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

#### Using Port Forwarding
The application is in a cluster since it's service type is `ClusterIP` with the IP address of your Kubernetes node. Since we used Docker Desktop, this would be `localhost` but the service is not exposed by default..

You would have to use `kubectl port-forward` inorder to access the application. `port-forward` connects to the service’s port: 80, which reliably routes to the container’s targetPort: 3040. follow these steps:
1. Forward the service port to your local machine:
   ```bash
   kubectl port-forward service/todo-app-service 8080:80
   ```
2. Access the application on `http://localhost:8080`.

More detailed comments are provided as code comments of the `deployment-service.yaml` file.
