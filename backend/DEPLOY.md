# Deployment Guide - Backend on EC2 with Docker and Nginx

This guide explains how to deploy the Recruiting Platform backend on an EC2 instance using Docker and Nginx.

## Prerequisites

- EC2 instance running Ubuntu 20.04 or later
- SSH access to your EC2 instance
- Domain name (optional, but recommended)
- MongoDB Atlas connection string
- Gemini API key

## Step 1: Prepare EC2 Instance

### 1.1 Connect to your EC2 instance

```bash
ssh -i your-key.pem ubuntu@35.180.152.70
```

### 1.2 Update system packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose (choose one method)

# Method 1: Docker Compose V2 (recommended - included with Docker)
# Docker Compose V2 is included with Docker Desktop and newer Docker installations
# It uses: docker compose (with space, not hyphen)
# Verify: docker compose version

# Method 2: Docker Compose V1 (standalone binary)
# Only needed if docker compose doesn't work
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    ARCH="x86_64"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    ARCH="aarch64"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-${ARCH}" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
# Try both commands
docker compose version 2>/dev/null || docker-compose --version
```

### 1.4 Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Step 2: Deploy Application

### 2.1 Clone your repository

```bash
cd /home/ubuntu
git clone <your-repo-url> Recruiting-Plateforme
cd Recruiting-Plateforme/backend
```

### 2.2 Create .env file

```bash
nano .env
```

Add the following content:

```env
MONGO_URI=mongodb+srv://Drakaas:12deathenote34@clusterpfa.qtzjcaf.mongodb.net/recruiting?appName=ClusterPFA
PORT=4000
NODE_ENV=production
LOG_LEVEL=combined
CV_KEY=your_gemini_api_key_here
```

Save and exit (Ctrl+X, then Y, then Enter).

### 2.3 Build and run with Docker Compose

```bash
# Build the image
docker-compose build

# Start the container
docker-compose up -d

# Check logs
docker-compose logs -f

# Check if container is running
docker-compose ps
```

## Step 3: Configure Nginx

### 3.1 Copy nginx configuration

```bash
sudo cp nginx.conf /etc/nginx/sites-available/recruiting-api
```

### 3.2 Update CORS origins

Edit the nginx config to include your Vercel frontend URL:

```bash
sudo nano /etc/nginx/sites-available/recruiting-api
```

Replace `https://your-vercel-app.vercel.app` with your actual Vercel domain in all CORS headers.

### 3.3 Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/recruiting-api /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site if not needed
```

### 3.4 Test and reload Nginx

```bash
# Test configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

## Step 4: Configure Firewall (Security Group)

### 4.1 AWS Security Group

In your EC2 Security Group, allow:
- **Port 80 (HTTP)** - from anywhere (0.0.0.0/0)
- **Port 443 (HTTPS)** - from anywhere (if using SSL)
- **Port 22 (SSH)** - from your IP only

### 4.2 Ubuntu Firewall (UFW)

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

## Step 5: Verify Deployment

### 5.1 Check backend health

```bash
curl http://localhost:4000/health
# Should return: {"status":"ok"}
```

### 5.2 Check through Nginx

```bash
curl http://35.180.152.70/health
# Should return: {"status":"ok"}
```

### 5.3 Test API endpoint

```bash
curl http://35.180.152.70/api/health
```

## Step 6: Update Frontend (Vercel)

Update your Vercel frontend environment variable:

```env
VITE_API_BASE_URL=http://35.180.152.70/api
```

Or if you have a domain:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

## Step 7: SSL Certificate (Optional but Recommended)

### 7.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2 Get SSL certificate

```bash
sudo certbot --nginx -d your-domain.com
```

Follow the prompts. Certbot will automatically update your Nginx configuration.

### 7.3 Auto-renewal

Certbot sets up auto-renewal automatically. Test it:

```bash
sudo certbot renew --dry-run
```

## Maintenance Commands

### View logs

```bash
# Docker logs
docker-compose logs -f backend

# Nginx logs
sudo tail -f /var/log/nginx/recruiting-api-access.log
sudo tail -f /var/log/nginx/recruiting-api-error.log
```

### Restart services

```bash
# Restart backend
docker-compose restart backend

# Restart Nginx
sudo systemctl restart nginx
```

### Update application

```bash
cd /home/ubuntu/Recruiting-Plateforme/backend
git pull
docker-compose build
docker-compose up -d
```

### Backup uploads

```bash
# Create backup
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Restore backup
tar -xzf uploads-backup-YYYYMMDD.tar.gz
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs backend

# Check if port is in use
sudo netstat -tulpn | grep 4000

# Restart container
docker-compose restart backend
```

### Nginx 502 Bad Gateway

```bash
# Check if backend is running
docker-compose ps

# Check backend logs
docker-compose logs backend

# Test backend directly
curl http://localhost:4000/health
```

### CORS errors

- Verify your Vercel domain is correctly set in nginx.conf
- Check browser console for exact error
- Ensure `Access-Control-Allow-Credentials` is set if using cookies

### File upload issues

- Check `client_max_body_size` in nginx.conf (set to 10M)
- Verify uploads directory has correct permissions
- Check disk space: `df -h`

## Monitoring

### Set up basic monitoring

```bash
# Install htop for monitoring
sudo apt install htop -y

# Monitor resources
htop
```

### Check container stats

```bash
docker stats recruiting-backend
```

## Security Recommendations

1. **Use HTTPS**: Always use SSL certificates in production
2. **Firewall**: Restrict SSH access to your IP only
3. **Environment Variables**: Never commit .env file
4. **Regular Updates**: Keep system and Docker images updated
5. **Backup**: Set up regular backups of uploads directory
6. **Rate Limiting**: Already configured in Nginx
7. **Security Headers**: Already configured in Nginx

## Next Steps

- Set up automated backups
- Configure monitoring (CloudWatch, DataDog, etc.)
- Set up CI/CD pipeline
- Configure log rotation
- Set up alerts for downtime

