#!/bin/bash

curl -s -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d "{\"first_name\":\"Test\",\"email\":\"test@example.com\"}" | jq .
