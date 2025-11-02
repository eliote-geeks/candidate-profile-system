#!/bin/bash

# Load env
export $(cat /home/paul/Bureau/candidate-profile-system/.env.local | grep -v '^#' | xargs)

# Test POST to /api/profiles
echo "Testing POST /api/profiles..."
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "phone": "+237600000000",
    "location": "Yaoundé"
  }' \
  2>/dev/null | jq .
