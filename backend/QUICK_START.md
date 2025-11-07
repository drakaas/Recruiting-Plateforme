# Quick Start Guide - EC2 Deployment

## Quick Setup (5 minutes)

### 1. On your EC2 instance, run:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt update && sudo apt install nginx -y
```

### 2. Clone and setup:

```bash
cd /home/ubuntu
git clone <your-repo> Recruiting-Plateforme
cd Recruiting-Plateforme/backend

# Create .env file
nano .env
# Paste your environment variables (see .env.production.example)
```

### 3. Update Nginx CORS for your Vercel domain:

```bash
# Edit nginx.conf and replace 'your-vercel-app.vercel.app' with your actual Vercel domain
nano nginx.conf
# Use Ctrl+W to search and replace all occurrences
```

### 4. Deploy:

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh

# Setup Nginx
sudo cp nginx.conf /etc/nginx/sites-available/recruiting-api
sudo ln -s /etc/nginx/sites-available/recruiting-api /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Configure firewall:

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 6. Test:

```bash
curl http://35.180.152.70/api/health
```

## Update Vercel Frontend

In your Vercel project settings, add environment variable:

```
VITE_API_BASE_URL=http://35.180.152.70/api
```

## Common Commands

```bash
# View logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend

# Stop everything
docker-compose down

# Update and redeploy
git pull
./deploy.sh
```

