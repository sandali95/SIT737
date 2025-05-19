# 10.1P: Monitoring and Visibility

This is a simple todo application with only one service demonstrating GCP Kubernetes cluster usage.This is a continuation of 9.1p task. The project is now built in to two services the application and the database (mongo db). It is now deployed in to a kubernates cluster deployed in GCP. 


### How to Apply the Configuration and Deploy into GKE

Please refer task9p content.

#### Deployment


1. **Access the Application**  
   Wait for the external IP of the `todo-app` service to be assigned. Once available, access the application using the following URL:
   ```
   http://<external-ip>:3001/home
   ```
   Check the application health using:
   ```bash
   curl http://<external-ip>:3001/health
   ```

2. **Clean up**
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


### Monitoring and Logging

Google Kubernetes Engine (GKE) provides integrated monitoring and logging to help you observe and troubleshoot your applications and cluster resources.



#### Monitoring

- **Cloud Monitoring**: GKE automatically integrates with Google Cloud Monitoring, collecting metrics from your cluster and workloads. This includes CPU, memory, disk usage, and custom application metrics.
- **Enabling Monitoring**: By default, system metrics are collected. To ensure full monitoring is enabled, create or update your cluster with:
  ```bash
  gcloud container clusters create <CLUSTER_NAME> \
    --monitoring=SYSTEM,WORKLOAD
  ```
  or
  ```bash
  gcloud container clusters update <CLUSTER_NAME> \
    --monitoring=SYSTEM,WORKLOAD
  ```
- **Configure Metrics**: Use Google Cloud Metrics Explorer to monitor the following metrics for your Kubernetes cluster:
  - `kubernetes.io/container/cpu/usage_time`
  - `kubernetes.io/container/memory/used_bytes`

Apply filters such as:

  - resource.type=`k8s_container`
  - resource.labels.cluster_name=`todo-cluster`
  - labels.app=`todo-app`

These metrics can help troubleshoot issues with your GKE clusters and workloads.

#### Logging

- **Cloud Logging**: GKE automatically streams logs from system components and workloads to Google Cloud Logging.
- **Viewing Logs**: Access logs in the [Google Cloud Console Logging dashboard](https://console.cloud.google.com/logs/query).
- **kubectl logs**: For real-time logs, use:
  ```bash
  kubectl logs <pod-name> -n <namespace>
  ```
- **Configure Logs**: Use Google Cloud Logs Explorer to view logs for your Kubernetes pods. Apply filters such as:
  - resource.type=`k8s_container`
  - resource.labels.cluster_name=`todo-cluster`
  - labels.app=`todo-app`

#### Alerts

- **Setting Up Alerts**: Google Cloud Monitoring allows you to set up alerting policies to notify you when specific conditions are met, such as high CPU usage, memory consumption, or pod failures.
- **How to Create Alerts**:
  1. Go to the [Google Cloud Monitoring Alerting page](https://console.cloud.google.com/monitoring/alerts).
  2. Click **Create Policy**.
  3. Add a condition, such as monitoring `kubernetes.io/container/cpu/usage_time` or `kubernetes.io/container/memory/used_bytes`.
  4. Set the threshold and duration for the alert.
  5. Add notification channels (email, SMS, Slack, etc.).
  6. Save the policy.

Setting up alerts ensures you are proactively notified about issues in your GKE cluster, allowing for faster response and improved reliability.



