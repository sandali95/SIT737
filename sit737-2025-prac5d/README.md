# 5.2D: Dockerization- Publishing the microservice into the cloud

This is a continuation of 5.1P where we push the image to the artifact registry in GCP

## Step by Step Guide


1. **Set up GCP**
   
  * Login to the GCP account and select you project from the dropdown in the header bar.

  * Search for Artifact Registry and navigate.

  * Create a repository in following format
    Name: <Write any name>
    Format: Docker
    Mode: Standard
    Location type: Region
    Region: australia-southeast2
    Encryption: Google-managed encryption key 


2. **Build a docker image locally**
   
    Naviage to the project where the docker file is.
    Run,

    ```bash
    docker build -t <image-name> .  
    docker tag <image-name>:<version> LOCATION-docker.pkg.dev/PROJECT-ID/<repo-created>/<image-name>:<version>


3. **Push the image**    

    Configure authentication for Artifact Registry

    ```bash
    gcloud auth configure-docker LOCATION-docker.pkg.dev
    ```

    Push the image to Artifact Registry
    
    ```bash
    docker push LOCATION-docker.pkg.dev/PROJECT-ID/<repo-created>/<image-name>:<version>
    ```

4. **Run the image from GCP**

    Using docker run  we can run the image we just pushed in.It will pull the image and run it locally

    ```bash
    docker run -p <host-port>:<container-port> -e PORT=<container-port> LOCATION-docker.pkg.dev/PROJECT-ID/<repo-created>/<image-name>:<version>
    ```

    Access the web app in http://localhost: host-port /home     

