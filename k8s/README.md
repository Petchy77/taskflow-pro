# Kubernetes Manifests

Production-ready Kubernetes manifests for TaskFlow Pro.

## Architecture

- **Namespace:** `taskflow` for logical isolation
- **MySQL:** StatefulSet with PersistentVolumeClaim (5Gi)
- **Redis:** Deployment for caching layer
- **Backend:** Deployment with 2 replicas + HPA (2-5 pods)
- **Ingress:** NGINX-based external routing

## Deployment

```bash
# Deploy all manifests
kubectl apply -f k8s/

# Watch pods come up
kubectl get pods -n taskflow -w

# Check status
kubectl get all -n taskflow

# View backend logs
kubectl logs -n taskflow -l app=backend --tail=50 -f

# Port-forward for local testing
kubectl port-forward -n taskflow svc/backend 8080:8080
```

## Cleanup

```bash
kubectl delete namespace taskflow
```

## Resource Allocation

| Component | Replicas | Memory Request | CPU Request | Memory Limit | CPU Limit |
|-----------|----------|----------------|-------------|--------------|-----------|
| Backend   | 2-5      | 512Mi          | 250m        | 1Gi          | 500m      |
| MySQL     | 1        | 512Mi          | 250m        | 1Gi          | 500m      |
| Redis     | 1        | 128Mi          | 100m        | 256Mi        | 200m      |

## Production Notes

- Use **Sealed Secrets** or **External Secrets Operator** instead of plain Secret
- Configure proper **StorageClass** for MySQL (SSD recommended)
- Add **NetworkPolicies** for pod-to-pod communication
- Setup **Prometheus + Grafana** for monitoring
- Configure **PodDisruptionBudget** for high availability
