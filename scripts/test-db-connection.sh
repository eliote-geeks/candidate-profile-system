#!/bin/bash

# Test PostgreSQL connection via SSH tunnel
# Make sure SSH tunnel is running first: ./scripts/ssh-tunnel.sh

set -e

echo "🧪 Testing PostgreSQL connection..."
echo ""

# Check if tunnel is open
if ! nc -zv localhost 5432 2>/dev/null; then
    echo "❌ Cannot connect to localhost:5432"
    echo "   Make sure SSH tunnel is running: ./scripts/ssh-tunnel.sh"
    exit 1
fi

echo "✅ Tunnel is open on localhost:5432"
echo ""

# Test with psql if available
if command -v psql &> /dev/null; then
    echo "📊 Attempting database connection with psql..."
    PGPASSWORD="__n8n_BLANK_VALUE_e5362baf-c777-4d57-a609-6eaf1f9e87f6" psql \
        -h localhost \
        -U n8n_user \
        -d job_automation_db \
        -c "SELECT COUNT(*) as candidate_count FROM candidates; SELECT COUNT(*) as job_count FROM job_offers;"
    echo ""
    echo "✅ PostgreSQL connection successful!"
else
    echo "⚠️  psql not found. Install postgresql-client to test database connection."
fi
