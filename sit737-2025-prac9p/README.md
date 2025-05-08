# 9.1P: Adding a database to your application

This is a simple todo application with only one service demonstrating GCP Kubernetes cluster usage.This is a continuation of 6.1p task. The project is now built in to two services the application and the database (mongo db) 

### Docker
The `todo-app` is containerized using Docker. Below are the key details:

- **Docker Image**: `sandali95/todo-app:1.3`
- **Dockerfile**: A `Dockerfile` is used to build the image for the application.
- **Build Command**:
  ```bash
  docker build -t sandali95/todo-app:1.3 .
  ```
- **Push Command**:
  ```bash
  docker push sandali95/todo-app:1.3
  ```


### Deployment Configuration
The `todo-app` is deployed using a Kubernetes Deployment resource. Below are the key details:
- **API Version**: `apps/v1`
- **Kind**: `Deployment`
- **Name**: `todo-app`
- **Replicas**: `1`
- **Container Image**: `sandali95/todo-app:1.3`
- **Container Port**: `80`
- **Environment Variable**: `PORT=3040`

### Service Configuration
The `todo-app` is exposed using a Kubernetes Service resource. Below are the key details:
- **API Version**: `v1`
- **Kind**: `Service`
- **Name**: `todo-app-service`
- **Type**: `ClusterIP`
- **Port**: `80`
- **Target Port**: `3040`

### MongoDB Deployment Configuration
A MongoDB instance is deployed to provide a persistent database for the `todo-app`. Below are the key details:
- **API Version**: `apps/v1`
- **Kind**: `Deployment`
- **Name**: `mongo`
- **Replicas**: `1`
- **Container Image**: `mongo:6.0`
- **Container Port**: `27017`
- **Persistent Volume**: A PersistentVolumeClaim (PVC) is used to ensure data persistence.

### MongoDB PersistentVolumeClaim
The MongoDB deployment uses a PersistentVolumeClaim (PVC) to store data persistently. Below are the key details:
- **Name**: `mongo-pvc`
- **Namespace**: `todo-app`
- **Access Modes**: `ReadWriteOnce`
- **Storage Request**: `10Gi`

The PVC ensures that the database data is retained even if the MongoDB pod is restarted.

### MongoDB Secret Configuration
A Kubernetes `Secret` is used to securely store sensitive information such as the MongoDB root username and password. Below are the key details:
- **Name**: `mongo-secret`
- **Namespace**: `todo-app`
- **Type**: `Opaque`
- **Data**:
  - `MONGO_INITDB_ROOT_USERNAME`: The root username for MongoDB.
  - `MONGO_INITDB_ROOT_PASSWORD`: The root password for MongoDB.
  - `MONGO_URI`: The connection URI for the MongoDB instance.

The `Secret` is mounted as environment variables in the MongoDB container to securely pass the credentials.

### MongoDB Service Configuration
The MongoDB instance is exposed using a Kubernetes Service resource. Below are the key details:
- **API Version**: `v1`
- **Kind**: `Service`
- **Name**: `mongo`
- **Type**: `ClusterIP`
- **Port**: `27017`
- **Target Port**: `27017`


### How to Apply the Configuration and Deploy into GKE

#### Prerequisites
1. Create a GKE cluster in your GCP project. Follow the official guide: [Create a GKE Cluster](https://cloud.google.com/kubernetes-engine/docs/deploy-app-cluster#create_cluster).
2. Ensure that `kubectl` and `gcloud` CLI tools are installed and configured on your local machine.
3. Setup GCP CLI with gke-gcloud-auth-plugin 

#### Steps to Deploy

1. **Authenticate with GCP**  
   Run the following commands to authenticate and configure your GCP project:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   gcloud container clusters get-credentials YOUR_CLUSTER_NAME --region YOUR_CLUSTER_REGION
   ```
   This will attach the GCP cluster configurations to your local `kubeconfig` for usage.

2. **Update MongoDB Secrets**  
   Update the `mongo-secret` configuration in the `scripts/mongo-deployment.yaml` file with your MongoDB credentials:
   ```yaml
   stringData:
     MONGO_URI: mongodb://todo-user:securepassword@mongo:27017/todoapp?authSource=admin
     MONGO_INITDB_ROOT_USERNAME: todo-user
     MONGO_INITDB_ROOT_PASSWORD: securepassword
   ```

3. **Deploy MongoDB**  
   Apply the MongoDB deployment and service configuration:
   ```bash
   kubectl apply -f scripts/mongo-deployment.yaml
   ```
   Wait for the MongoDB pod to be in the `Running` state:
   ```bash
   kubectl get pods -n todo-app
   ```

4. **Deploy the Todo Application**  
   Apply the `todo-app` deployment and service configuration:
   ```bash
   kubectl apply -f scripts/deployment-service.yaml
   ```
   Wait for the deployment to complete:
   ```bash
   kubectl get pods -n todo-app
   kubectl get svc todo-app-service -n todo-app
   ```

5. **Verify the Deployments**  
   Check the status of the deployments and services:
   ```bash
   kubectl get deployments -n todo-app
   kubectl get services -n todo-app
   ```

6. **Access the Application**  
   Wait for the external IP of the `todo-app` service to be assigned. Once available, access the application using the following URL:
   ```
   http://<external-ip>:3001/home
   ```
   Check the application health using:
   ```bash
   curl http://<external-ip>:3001/health
   ```

7. **Clean up**
   To tear down
   ```
   kubectl delete namespace todo-app
   ```
   That will remove Mongo, PVC, Secrets, and the Todo service in one go.


### Troubleshooting Guide

This section provides solutions to common issues that may arise during deployment.

#### 1. Run the Scripts Locally
Before deploying to GKE, test the scripts in your local Kubernetes environment. This makes it easier to debug and resolve issues.

#### 2. Pods Pending (No Nodes Available)
If your pods are stuck in the `Pending` state due to insufficient resources, diagnose the issue with the following command:
```bash
kubectl describe pod <pod-name> -n todo-app
```
To resolve the issue, either update your deployment script to request fewer resources or scale up the cluster:
```bash
gcloud container clusters resize YOUR_CLUSTER_NAME \
  --zone=${GKE_CLUSTER_ZONE} --node-pool=default-pool --num-nodes=3
```

#### 3. Service LoadBalancer EXTERNAL-IP `<pending>`
If the `EXTERNAL-IP` of your service is stuck in the `<pending>` state, check the service status:
```bash
kubectl get svc todo-service -n todo-app
```
Then, describe the service to identify the issue:
```bash
kubectl describe svc todo-service -n todo-app
```
Verify that the `todo-service` deployment script is correctly configured.


#### 4. PersistentVolumeClaim Issues
If the MongoDB pod fails to start due to PVC issues, check the status of the PVC:
```bash
kubectl get pvc -n todo-app
```
Describe the PVC for more details:
```bash
kubectl describe pvc mongo-pvc -n todo-app
```
Ensure that your cluster has sufficient storage resources to fulfill the PVC request.

#### 5. Application Health Check Fails
If the application health check fails, verify the service and pod status:
```bash
kubectl get pods -n todo-app
kubectl get svc todo-app-service -n todo-app
```
Check the application logs for errors:
```bash
kubectl logs <todo-app-pod-name> -n todo-app
```
Check the pod events
  ```bash
  kubectl describe pod <pod-name> -n todo-app
  ```

### Database Backup & Disaster Recovery (Manual)

This section provides steps to manually back up and restore the MongoDB database in your Kubernetes cluster.

#### 1. Backup MongoDB Data
To back up the MongoDB database, use the `mongodump` command inside the MongoDB pod. Replace `<mongo-pod-name>` with the name of your MongoDB pod:
```bash
kubectl exec -it <mongo-pod-name> -n todo-app -- mongodump --db todoapp --username $(kubectl get secret mongo-secret -n todo-app -o jsonpath="{.data.MONGO_INITDB_ROOT_USERNAME}" | base64 --decode) --password $(kubectl get secret mongo-secret -n todo-app -o jsonpath="{.data.MONGO_INITDB_ROOT_PASSWORD}" | base64 --decode) --authenticationDatabase admin --out /tmp/backup
```

#### 2. Copy Backup to Local Machine
Copy the backup files from the MongoDB pod to your local machine. Replace `<mongo-pod-name>` with the name of your MongoDB pod:
```bash
kubectl cp todo-app/<mongo-pod-name>:/tmp/backup ./local-backup
```

#### 3. Restore MongoDB Data
To restore the MongoDB database, use the `mongorestore` command inside the MongoDB pod. Replace `<mongo-pod-name>` with the name of your MongoDB pod:
```bash
kubectl exec -it <mongo-pod-name> -n todo-app -- mongorestore --db todoapp --username $(kubectl get secret mongo-secret -n todo-app -o jsonpath="{.data.MONGO_INITDB_ROOT_USERNAME}" | base64 --decode) --password $(kubectl get secret mongo-secret -n todo-app -o jsonpath="{.data.MONGO_INITDB_ROOT_PASSWORD}" | base64 --decode) --authenticationDatabase admin /tmp/backup
```

- The backup files will be stored in the `./local-backup` directory on your local machine.
