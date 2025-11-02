# RecruitAI API Documentation

## Overview

This document describes the API endpoints for the RecruitAI candidate profile system. The API enables profile creation, management, and integration with n8n workflows.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API uses no authentication. In production, implement JWT or API key authentication.

---

## Endpoints

### 1. Create Candidate Profile

**Endpoint:** `POST /api/profiles`

**Description:** Creates a new candidate profile and triggers the n8n job search workflow.

**Request Body:**
```json
{
  "firstName": "Paul",
  "lastName": "Dupont",
  "email": "paul@example.com",
  "phone": "+237 6XX XX XX XX",
  "location": "Douala, Cameroon",
  "currentTitle": "Developer",
  "yearsExperience": 5,
  "currentCompany": "TechCorp",
  "sector": "IT/Tech",
  "skills": ["JavaScript", "React", "Node.js"],
  "languages": ["French", "English"],
  "educationLevel": "Master",
  "degree": "Computer Science",
  "institution": "University of Douala",
  "desiredPositions": ["Full Stack Developer", "Tech Lead"],
  "desiredSectors": ["IT/Tech", "Finance"],
  "desiredLocations": ["Douala", "Remote"],
  "minSalary": 500000,
  "contractTypes": ["CDI", "Freelance"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Profile created successfully",
  "profileId": "profile_1730280123456_abc123def",
  "redirectUrl": "/dashboard"
}
```

**Error Responses:**

- **400 Bad Request:** Missing required fields
```json
{
  "error": "Missing required fields: firstName and email"
}
```

- **409 Conflict:** Email already registered
```json
{
  "error": "Email already registered"
}
```

- **500 Internal Server Error:** Server error
```json
{
  "error": "Failed to create profile"
}
```

---

### 2. Get All Profiles (Admin)

**Endpoint:** `GET /api/profiles`

**Description:** Retrieves all candidate profiles. Admin only in production.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "profiles": [
    {
      "id": "profile_1730280123456_abc123def",
      "firstName": "Paul",
      "lastName": "Dupont",
      "email": "paul@example.com",
      "createdAt": "2025-10-30T12:34:56.789Z",
      ...
    }
  ]
}
```

---

### 3. Get Profile Details

**Endpoint:** `GET /api/profiles/[id]`

**Description:** Retrieves a specific candidate profile.

**Response (200 OK):**
```json
{
  "success": true,
  "profile": { ... }
}
```

**Error Responses:**

- **404 Not Found:** Profile doesn't exist
- **500 Internal Server Error:** Server error

---

### 4. Update Profile

**Endpoint:** `PUT /api/profiles/[id]`

**Description:** Updates a candidate profile.

**Request Body:** Same structure as profile creation (partial updates supported)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": { ... }
}
```

---

### 5. Delete Profile

**Endpoint:** `DELETE /api/profiles/[id]`

**Description:** Deletes a candidate profile.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile deleted successfully"
}
```

---

### 6. Health Check

**Endpoint:** `GET /api/health`

**Description:** Returns API health status.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T12:34:56.789Z",
  "uptime": 3600.5,
  "environment": "production"
}
```

---

## N8N Webhook Integration

### Incoming Webhook (N8N → RecruitAI)

**Endpoint:** `POST /api/webhooks/n8n`

**Description:** Receives job offers, CV generation notifications, and application status from n8n workflows.

**Event Types:**

#### 1. Jobs Found
```json
{
  "event": "jobs.found",
  "profileId": "profile_1730280123456_abc123def",
  "timestamp": "2025-10-30T12:34:56.789Z",
  "jobs": [
    {
      "externalId": "job_123",
      "title": "Senior Developer",
      "company": "TechCorp",
      "location": "Douala",
      "salary": "500000 - 700000 FCFA",
      "description": "We are looking for...",
      "url": "https://example.com/jobs/123",
      "relevanceScore": 0.95,
      "matchedSkills": ["React", "Node.js"]
    }
  ]
}
```

#### 2. CV Generated
```json
{
  "event": "cv.generated",
  "profileId": "profile_1730280123456_abc123def",
  "timestamp": "2025-10-30T12:34:56.789Z",
  "cvUrl": "https://storage.example.com/cv_abc123.pdf"
}
```

#### 3. Application Sent
```json
{
  "event": "application.sent",
  "profileId": "profile_1730280123456_abc123def",
  "jobId": "job_123",
  "applicationId": "app_456",
  "timestamp": "2025-10-30T12:34:56.789Z"
}
```

#### 4. Workflow Error
```json
{
  "event": "workflow.error",
  "profileId": "profile_1730280123456_abc123def",
  "workflowName": "job_search_workflow",
  "error": {
    "message": "Failed to scrape job listings",
    "code": "SCRAPER_ERROR"
  },
  "timestamp": "2025-10-30T12:34:56.789Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event processed",
  "timestamp": "2025-10-30T12:34:56.789Z"
}
```

---

## Outgoing Webhook (RecruitAI → N8N)

### Trigger Profile Processing

When a new profile is created via `POST /api/profiles`, the system automatically triggers the n8n webhook:

**URL:** `${NEXT_PUBLIC_N8N_WEBHOOK_URL}`

**Method:** `POST`

**Payload:**
```json
{
  "event": "profile.created",
  "data": {
    "id": "profile_1730280123456_abc123def",
    "firstName": "Paul",
    "lastName": "Dupont",
    "email": "paul@example.com",
    "skills": ["JavaScript", "React", "Node.js"],
    "desiredPositions": ["Full Stack Developer"],
    "minSalary": 500000,
    ...
  },
  "timestamp": "2025-10-30T12:34:56.789Z"
}
```

---

## Environment Variables

```env
# n8n Configuration
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/candidate-profile-created
N8N_API_KEY=your-n8n-api-key

# Database (future)
DATABASE_URL=postgresql://user:password@localhost:5432/recruitai
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200 OK:** Successful GET/PUT request
- **201 Created:** Successful POST request
- **400 Bad Request:** Invalid request data
- **404 Not Found:** Resource not found
- **409 Conflict:** Resource already exists
- **500 Internal Server Error:** Server error
- **501 Not Implemented:** Feature not yet implemented

Error Response Format:
```json
{
  "error": "Human-readable error message"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. In production, implement rate limiting to prevent abuse.

---

## Security Considerations

1. **Authentication:** Implement JWT or API key authentication
2. **Data Validation:** All inputs are validated server-side
3. **HTTPS:** Use HTTPS in production
4. **CORS:** Configure CORS appropriately for your domain
5. **SQL Injection:** N/A (using TypeScript with type safety)
6. **XSS Protection:** React handles escaping automatically

---

## Testing

### Using cURL

```bash
# Create profile
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Paul",
    "email": "paul@example.com",
    "currentTitle": "Developer",
    "skills": ["React"]
  }'

# Get all profiles
curl http://localhost:3000/api/profiles

# Health check
curl http://localhost:3000/api/health
```

### Using Postman

1. Create a new collection for RecruitAI
2. Import the endpoints documented above
3. Set up environment variables for base URL
4. Test each endpoint with sample data

---

## Future Enhancements

- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Job listing caching
- [ ] Application tracking
- [ ] Email notifications
- [ ] CSV export of profiles
- [ ] Advanced filtering and search
- [ ] Analytics dashboard for admins
- [ ] Rate limiting
- [ ] API versioning (v1, v2, etc.)

---

## Support

For issues or questions, contact: support@recruitai.com

Last Updated: 2025-10-30
