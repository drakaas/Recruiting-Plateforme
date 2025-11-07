# Fix Docker Compose Installation Issue

## Problem
Error: `/usr/local/bin/docker-compose: cannot execute binary file`

This usually means:
1. Wrong architecture (32-bit vs 64-bit)
2. Docker Compose V2 is installed (uses `docker compose` instead of `docker-compose`)

## Solution

### Option 1: Use Docker Compose V2 (Recommended)

Docker Compose V2 is included with Docker and uses `docker compose` (with space).

Check if it's available:
```bash
docker compose version
```

If it works, the deploy script will automatically detect and use it.

### Option 2: Install Docker Compose V1 (Standalone)

If you need the standalone `docker-compose` command:

```bash
# Detect your architecture
ARCH=$(uname -m)
echo "Architecture: $ARCH"

# Download the correct binary
if [ "$ARCH" = "x86_64" ]; then
    ARCH="x86_64"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    ARCH="aarch64"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

# Download and install
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-${ARCH}" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker-compose --version
```

### Option 3: Remove and Reinstall

If the binary is corrupted:

```bash
# Remove old binary
sudo rm -f /usr/local/bin/docker-compose

# Reinstall using Option 2 above
```

### Option 4: Use Docker Compose Plugin

Install as Docker plugin:

```bash
# Install Docker Compose plugin
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Use as: docker compose (with space)
docker compose version
```

## Verify Installation

After fixing, verify:

```bash
# Check Docker Compose V2
docker compose version

# OR check Docker Compose V1
docker-compose --version

# The deploy script will automatically detect which one works
```

## Quick Test

```bash
cd backend
./deploy.sh
```

The script will automatically detect and use the correct command.

