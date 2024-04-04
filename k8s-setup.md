# k8s setup process

## Build Docker images

### Backend
```bash
cd backend
docker build -t zebangeth/campuscycle:backend-latest .
docker push zebangeth/campuscycle:backend-latest
cd ..
```

### UI (NGINX)
```bash
cd frontend
docker build -t zebangeth/campuscycle:frontend-latest .
docker push zebangeth/campuscycle:frontend-latest
cd ..
```

## Deploy on Kubernetes

```bash
kubectl create -f k8s/
```

**OR** use the commands below to apply each manifest separately, which gives you more control over each deployment and can be helpful for debugging purposes

```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f mongo-deployment.yaml
kubectl apply -f mongo-service.yaml
```

## Undeploy

Undeploy before re-deploying if you make a change to the app. Also remember to rebuild Docker images.

```bash
kubectl delete -f k8s/
```

## Mongo setup

The necessary database setup is handled by the application code, so no MongoDB setup step is required. 

## Debug Steps

1. Check the status of your pods:

   ```bash
   kubectl get pods
   ```

   If any of the pods are not running or are in an error state, you can check the pod logs (Step 3).

2. Check the status of your services:

   ```bash
   kubectl get services
   ```

   Ensure that the frontend and backend services are created and have the correct port mappings. 

3. Check the logs of your pod:

   ```bash
   kubectl logs <pod-name>
   ```

   Replace `<pod-name>` with the actual name.
