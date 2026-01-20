
# Project: GitOps Kubernetes Cluster on Google Cloud with Terraform, Ansible, Linkerd, ArgoCD & Blue-Green Deployments


## 1. Project Overview & Motivation

This project demonstrates a complete, modern DevOps workflow on **Google Cloud Platform (GCP)**:

- Provision infrastructure using **Terraform modules** (network + compute).
- Use **Ansible** to automate Docker & Kubernetes installation.
- Bootstrap a basic **Kubernetes cluster** with kubeadm (1 master + 1 worker).
- Add **Linkerd** service mesh for observability, traffic management, and mTLS.
- Implement **GitOps** continuous deployment with **ArgoCD**.
- Use **GitHub Actions** to build/push Docker images.
- Achieve **zero-downtime** blue-green deployments via ArgoCD manifests in Git.

### Why This Project?
Kubernetes is the standard for container orchestration, but production-grade setups require:
- Repeatable infrastructure (IaC)
- Automated node provisioning & cluster bootstrap
- Observability & security (service mesh)
- Declarative, automated deployments (GitOps)
- Safe rollout strategies (blue-green)

This project solves common pain points:
- Manual VM setup and Kubernetes installation → error-prone and time-consuming.
- Configuration drift between desired (Git) and actual cluster state.
- Risky deployments without zero-downtime strategies.
- Lack of visibility into microservices traffic & failures.

**Goal achieved**: Fully automated, observable, GitOps-driven Kubernetes cluster on GCP with safe blue-green application rollouts.

## 2. High-Level Architecture

- **Infrastructure**: GCP Compute Engine VMs (1 master + 1 worker) provisioned via Terraform modules.
- **Automation**: Ansible for Docker + Kubernetes setup.
- **Cluster**: kubeadm-based Kubernetes.
- **Service Mesh**: Linkerd (lightweight, adds observability, retries, timeouts, mTLS).
- **CI/CD**: GitHub Actions → build Docker image → push to Docker Hub.
- **GitOps CD**: ArgoCD syncs manifests from Git → deploys application with blue-green strategy.




(Terraform + GCP architecture visuals)






(ArgoCD blue-green deployment workflows)

## 3. Technologies & Tools
- **Cloud**: Google Cloud Platform (Compute Engine)
- **IaC**: Terraform (modular: network & compute modules)
- **Configuration Management**: Ansible
- **Container Runtime**: Docker
- **Kubernetes**: kubeadm (v1.28+)
- **Service Mesh**: Linkerd
- **GitOps/CD**: ArgoCD
- **CI**: GitHub Actions
- **Registry**: Docker Hub

## 4. Step-by-Step Implementation

### Step 1: Infrastructure with Terraform Modules
1. Structure:
   - `modules/network/` → VPC, subnets, firewall rules (allow SSH, kubeadm ports, Linkerd).
   - `modules/compute/` → google_compute_instance resources with startup script or metadata.
   - `main.tf` → calls modules, creates 2 instances (master + worker).

2. Key firewall rules:
   - SSH (22)
   - Kubernetes API (6443)
   - etcd (2379-2380)
   - NodePort/services (30000-32767)
   - Linkerd ports (e.g., 4143, 4191)

3. Apply:
   ```bash
   terraform init
   terraform plan
   terraform apply

### Ansible Automation – Install Docker & Kubernetes
*  create Ansible inventory hosts.ini file  with master & worker IPs.
*  create  playbook to install docker  in both vm
*  install-docker.yml: Install Docker + containerd.
*  install-kubernetes.yml Add Kubernetes repos, install kubeadm/kubelet/kubectl, disable swap, configure sysctl.
*  run ansible playbook to install  docker and kubernates
```
ansible-playbook -i hosts.ini install-docker.yml
ansible-playbook -i hosts.ini install-kubernetes.yml
```
### Bootstrap Kubernetes Cluster with kubeadm
```
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
# install falnnel for network
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
```
### Get join command from output → run on worker
```
sudo kubeadm join <master-ip>:6443 --token ... --discovery-token-ca-cert-hash ...
kubectl get nodes
```
### Install Linkerd Service Mesh
* linkerd  is used to monitor the network
```
linkerd install --crds | kubectl apply -f -
linkerd install | kubectl apply -f -
linkerd check
```
### Enable mTLS & visualization
```
linkerd viz install | kubectl apply -f -
linkerd viz dashboard &
```

