# VPS Docker Cleanup Guide - Free RAM & Disk Space

**Problem**: Docker containers, images, and volumes are consuming too much disk space and RAM on the VPS.

**Solution**: Clean up unused Docker resources safely.

---

## Quick Reference: Space Savings

| Command | Space Freed | Risk Level | Description |
|---------|------------|-----------|-------------|
| `docker container prune -f` | 500MB - 2GB | 🟢 Safe | Remove stopped containers |
| `docker image prune -f` | 1GB - 5GB | 🟢 Safe | Remove unused images |
| `docker volume prune -f` | 100MB - 500MB | 🟡 Caution | Remove unused volumes (may lose data) |
| `docker network prune -f` | <10MB | 🟢 Safe | Remove unused networks |
| `docker system prune -a -f` | 5GB - 20GB+ | 🔴 Aggressive | Remove ALL unused (images, containers, volumes, networks) |

---

## Step-by-Step Cleanup

### 1. Check Current Space Usage

```bash
# Overall filesystem usage
df -h
# Shows: filesystem, size, used, available, use%, mounted on

# Example output:
# /dev/sda1          50G  42G   8.0G  84% /
# ^ This means 8GB free space

# Docker-specific space
docker system df
# Shows: RECLAIMABLE column = space you can free

# Example output:
# Images      25      5      15.4GB  10.2GB
#                             ^       ^
#                          total   reclaimable
```

### 2. Stop Running Containers (Optional, but safer)

```bash
# View running containers
docker ps
# Lists: CONTAINER ID, IMAGE, NAMES, STATUS

# Stop all running containers (if you want to be safe)
docker stop $(docker ps -q)

# Or just continue - the prune commands won't affect running containers
```

### 3. Remove Stopped Containers

```bash
# List stopped containers
docker ps -a --filter "status=exited"

# Remove them
docker container prune -f

# Expected: "Deleted Containers: <number>"
# Space freed: 500MB - 2GB (each container ~50-500MB)
```

### 4. Remove Unused Images

```bash
# List unused images (dangling)
docker images -f "dangling=true"

# Remove them
docker image prune -f

# OR remove unused images (not just dangling)
docker image prune -a -f
# WARNING: -a removes ALL unused images, not just dangling ones

# Expected: "Deleted Images: <number>"
# Space freed: 1GB - 5GB (depends on number of images)
```

### 5. Remove Unused Volumes (⚠️ Be Careful)

```bash
# List unused volumes
docker volume ls -f "dangling=true"

# Remove them
docker volume prune -f

# ⚠️ WARNING: This deletes data that's no longer in use!
# Only do this if you're sure you don't need the data

# Expected: "Deleted Volumes: <number>"
# Space freed: 100MB - 500MB
```

### 6. Remove Unused Networks

```bash
# List unused networks
docker network ls

# Remove them
docker network prune -f

# Expected: "Deleted Networks: <number>"
# Space freed: <10MB (networks use minimal space)
```

### 7. Verify Space Freed

```bash
# Check disk space again
df -h
# Should show increased "available" space

# Check Docker space
docker system df
# RECLAIMABLE column should be smaller
```

---

## Fast Cleanup (Recommended for VPS)

If you just want to free space quickly and safely:

```bash
# Run these commands in order
docker container prune -f      # Remove stopped containers
docker image prune -f          # Remove dangling images
docker volume prune -f         # Remove unused volumes
docker network prune -f        # Clean up networks

# Verify
docker system df
df -h
```

**Expected**: 2GB - 8GB freed, no running containers affected

---

## Aggressive Cleanup (Use Only If Desperate)

If you need to free significant space and understand the risks:

```bash
# WARNING: This removes ALL unused Docker resources
# It will remove images you may want to rebuild later!

docker system prune -a -f

# Space freed: 5GB - 20GB+ (everything unused)
# Downside: Next build will be slow (needs to rebuild images)
```

---

## Safe Approach for Production VPS

**Recommended sequence** (minimizes disruption):

### Before Cleanup
```bash
# Note current state
docker system df > /tmp/docker-before.txt
df -h > /tmp/disk-before.txt

# Stop applications gracefully (if not critical)
pm2 stop candidate-profile-system
pm2 stop n8n
# OR just continue running - prune won't affect them
```

### Run Cleanup
```bash
docker container prune -f
docker image prune -f
docker volume prune -f
docker network prune -f
```

### After Cleanup
```bash
# Verify everything works
docker ps                          # Check containers running
docker system df                   # Check reclaimed space
df -h                             # Check filesystem

# Restart services if stopped
pm2 restart candidate-profile-system
pm2 restart n8n
# Or just continue if still running
```

---

## What Gets Deleted (and What Doesn't)

### ✅ Safe to Delete (Won't Affect Running Services)
- Stopped containers (`docker container prune`)
- Dangling images - orphaned image layers (`docker image prune -f`)
- Volumes not used by any container (`docker volume prune -f`)
- Networks not connected to any container (`docker network prune -f`)

### ❌ NOT Deleted (Stays Intact)
- Running containers (protected)
- Images in use by running containers (protected)
- Volumes attached to running containers (protected)
- Container networks in use (protected)
- Database data in persistent volumes (protected)

### ⚠️ Deleted if `-a` Flag Used (Potential Issue)
- Images with no container history
- Will require rebuild if needed again
- Slows down next container startup

---

## Manual Cleanup (Advanced)

### Remove Specific Container
```bash
# List containers
docker ps -a

# Remove specific container by ID
docker rm <container-id>

# Remove multiple
docker rm <id1> <id2> <id3>
```

### Remove Specific Image
```bash
# List images
docker images

# Remove image by ID or name
docker rmi <image-id>
docker rmi <image-name>

# Force remove if in use
docker rmi -f <image-id>
```

### Remove Specific Volume
```bash
# List volumes
docker volume ls

# Remove volume
docker volume rm <volume-name>

# WARNING: This deletes the data!
```

---

## Monitoring Disk Space

### Setup Automatic Cleanup (Linux Cron)

To automatically clean up Docker every night:

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * docker container prune -f && docker image prune -f && docker volume prune -f
```

### Monitor in Real-Time
```bash
# Watch disk usage
watch -n 5 'df -h && echo "---" && docker system df'

# Refresh every 5 seconds
# Press Ctrl+C to exit
```

---

## Troubleshooting

### Error: "Cannot remove running container"
**Cause**: Container is still running
**Solution**: `docker stop <container-id>` first, then prune

### Error: "Cannot remove volume - in use"
**Cause**: Volume is still attached to container
**Solution**: Stop/remove the container first

### Error: "No space left on device"
**Cause**: Disk is completely full
**Solution**: Use aggressive cleanup: `docker system prune -a -f`

### Service stops after cleanup
**Cause**: Image was deleted and container references it
**Solution**: Restart the service (it will rebuild the image)

---

## VPS-Specific Commands

### On Your VPS (root@88.222.221.7)

```bash
# SSH into VPS
ssh root@88.222.221.7

# Check space before
df -h
docker system df

# Run safe cleanup
docker container prune -f
docker image prune -f
docker volume prune -f

# Check space after
df -h
docker system df

# If needed, restart services
pm2 restart all

# Verify services are running
pm2 status
pm2 logs
```

---

## Expected Results

### Before Cleanup
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   42G  8.0G  84%  /

Docker data:
Images      25      5      15.4GB  10.2GB
Containers  50     10      8.5GB    5.2GB
Volumes     30      5      3.2GB    1.8GB
Build                      2.1GB    2.1GB
```

### After Cleanup
```
Filesystem      Size  Used Avail Use%  Mounted on
/dev/sda1        50G   32G  18.0G  64%  /   ← 10GB freed!

Docker data:
Images      12      5      5.2GB    0.8GB
Containers  20     10      5.5GB    0.5GB
Volumes      5      5      1.4GB    0MB
Build                      0.5GB    0.5GB
```

---

## Summary

1. **Quick Check**: `docker system df` and `df -h`
2. **Safe Cleanup**: Run all 4 prune commands
3. **Verify**: Re-run `docker system df` and `df -h`
4. **Restart**: `pm2 restart all`
5. **Monitor**: `pm2 logs` to check for errors

**Expected result**: 10-15GB freed, all services still running

---

## When to Clean Up

- ✅ Disk usage > 80% (`df -h`)
- ✅ Docker reclaimable space > 5GB (`docker system df`)
- ✅ After building many images
- ✅ Before deploying new version
- ✅ Monthly maintenance schedule

---

## Additional Resources

```bash
# Get more info about Docker cleanup
docker help container prune
docker help image prune
docker help volume prune
docker help system prune

# Check Docker disk usage details
docker system df --verbose
```

