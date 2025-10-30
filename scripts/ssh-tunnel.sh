#!/bin/bash

# SSH Tunnel to PostgreSQL on VPS
# This script creates a secure tunnel from localhost:5432 to the n8n PostgreSQL container
# Usage: ./scripts/ssh-tunnel.sh

set -e

VPS_HOST="88.222.221.7"
VPS_USER="root"
CONTAINER_IP="172.19.0.3"
LOCAL_PORT="5432"

echo "🔌 Creating SSH tunnel to PostgreSQL on VPS..."
echo "   Local:    localhost:${LOCAL_PORT}"
echo "   Remote:   ${VPS_HOST} → ${CONTAINER_IP}:5432 (n8n-postgres)"
echo ""
echo "Keep this terminal open while developing."
echo "Press Ctrl+C to stop the tunnel."
echo ""

# Create SSH tunnel
# -L = Local port forwarding
# 5432:172.19.0.3:5432 = Forward localhost:5432 to container 172.19.0.3:5432
# -N = Don't execute a remote command (just forwarding)
# -v = Verbose (show connection details)

ssh -L ${LOCAL_PORT}:${CONTAINER_IP}:5432 "${VPS_USER}@${VPS_HOST}" -N -v
