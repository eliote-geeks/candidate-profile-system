# Workflow Integration Guide

## Overview

This document describes how to integrate the candidate profile system with n8n workflows for job automation.

## Workflows

### 1. JobinCamer Scraper + Details (FIXED DB SCHEMA)
- **Purpose**: Scrape job offers from JobinCamer and extract details
- **Output**: Job offers stored in database
- **Integration Point**: Used by Job Analyzer to analyze matches

### 2. AI Job Analyzer (Gemini)
- **Purpose**: Analyze job compatibility with candidate profile
- **Input**: Candidate profile + Job offer
- **Output**: Match percentage, matched/missing skills, recommendation
- **Webhook**: `/api/workflows/webhooks/job-analyzed`

### 3. CV Generator (Gemini)
- **Purpose**: Generate personalized CV for candidate
- **Input**: Candidate profile + Optional job description for tailored CV
- **Output**: CV content (JSON/Markdown/HTML), compatibility score
- **Webhook**: `/api/workflows/webhooks/cv-generated`

### 4. Application Sender (CORRECTED)
- **Purpose**: Send job applications with generated CV
- **Input**: Profile ID, Job ID, CV content, Candidate email
- **Output**: Application status, confirmation URL
- **Webhook**: `/api/workflows/webhooks/application-sent`

## Environment Variables

Create a `.env.local` file with the following webhook URLs from your n8n instance:

```env
# N8N Workflow Webhooks
N8N_CV_GENERATOR_WEBHOOK=https://your-n8n-instance/webhook/cv-generator
N8N_JOB_ANALYZER_WEBHOOK=https://your-n8n-instance/webhook/job-analyzer
N8N_APPLICATION_SENDER_WEBHOOK=https://your-n8n-instance/webhook/application-sender

# Webhook Receivers (your Next.js instance)
# These are called by n8n to send back results
# Configure in n8n:
# - CV Generator → POST /api/workflows/webhooks/cv-generated
# - Job Analyzer → POST /api/workflows/webhooks/job-analyzed
# - Application Sender → POST /api/workflows/webhooks/application-sent
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

## API Endpoints

### Trigger Workflows

#### 1. Generate CV
```bash
POST /api/workflows/cv-generator

Body: {
  "profileId": "profile_1234567890_abc",
  "candidateProfile": { /* CandidateProfile object */ },
  "jobId": "job_optional", // Optional for tailored CV
  "jobDescription": "..." // Optional
}

Response: { status: 202, workflowId: "..." }
```

#### 2. Analyze Job
```bash
POST /api/workflows/job-analyzer

Body: {
  "profileId": "profile_1234567890_abc",
  "jobId": "job_123",
  "jobOffer": { /* JobOffer object */ },
  "candidateProfile": { /* CandidateProfile object */ }
}

Response: { status: 202, workflowId: "..." }
```

#### 3. Send Application
```bash
POST /api/workflows/application-sender

Body: {
  "profileId": "profile_1234567890_abc",
  "jobId": "job_123",
  "jobOffer": { /* JobOffer object */ },
  "cvContent": "CV markdown or HTML content",
  "motivationLetter": "Optional letter",
  "candidateEmail": "candidate@example.com",
  "candidateName": "John Doe"
}

Response: { status: 202, applicationId: "..." }
```

### Retrieve Workflow Results

#### Get Generated CV
```bash
GET /api/workflows/webhooks/cv-generated?profileId=xxx&jobId=yyy

Response: {
  "success": true,
  "cv": {
    "profileId": "...",
    "cvContent": "...",
    "cvFormat": "markdown",
    "generatedAt": "2024-...",
    "compatibilityScore": 85
  }
}
```

#### Get Job Analysis
```bash
GET /api/workflows/webhooks/job-analyzed?profileId=xxx&jobId=yyy

Response: {
  "success": true,
  "analysis": {
    "profileId": "...",
    "jobId": "...",
    "matchPercentage": 85,
    "matchedSkills": ["Python", "React", "..."],
    "missingSkills": ["Docker"],
    "salaryMatch": true,
    "recommendation": "apply"
  }
}
```

#### Get Application Status
```bash
GET /api/workflows/webhooks/application-sent?profileId=xxx&jobId=yyy

Response: {
  "success": true,
  "application": {
    "profileId": "...",
    "jobId": "...",
    "applicationId": "app_...",
    "status": "sent",
    "sentAt": "2024-...",
    "confirmationUrl": "..."
  }
}
```

## Workflow Data Flow

```
1. Create Profile
   ↓
2. Profile Stored in API
   ↓
3. Generate CV
   ├→ N8N CV Generator (Gemini)
   └→ Store CV in /api/workflows/webhooks/cv-generated
   ↓
4. Get Job from JobinCamer
   ↓
5. Analyze Job Match
   ├→ N8N Job Analyzer (Gemini)
   ├→ Compare profile vs job
   └→ Store analysis in /api/workflows/webhooks/job-analyzed
   ↓
6. If Match ≥ Threshold
   ├→ Send Application
   ├→ N8N Application Sender
   ├→ Include generated CV
   └→ Store status in /api/workflows/webhooks/application-sent
   ↓
7. Track in Dashboard
```

## Candidate Profile Schema

### Required Fields for Workflows

**For CV Generator:**
- firstName, lastName, email
- currentTitle, yearsExperience, currentCompany
- skills, technicalSkills, softSkills
- languages
- educationLevel, degree, institution
- workExperience (array of job history)
- summary (optional but recommended)

**For Job Analyzer:**
- firstName, lastName, email
- skills, technicalSkills, softSkills
- yearsExperience
- desiredSalary (minSalary, maxSalary)
- desiredLocations
- contractTypes
- languages

**For Application Sender:**
- candidateEmail (from profile)
- firstName, lastName (for greeting)
- Generated CV (from CV Generator)
- Optional: motivationLetter

## Testing

### 1. Test CV Generation
```bash
curl -X POST http://localhost:3000/api/workflows/cv-generator \
  -H "Content-Type: application/json" \
  -d '{
    "profileId": "test_profile_123",
    "candidateProfile": {
      "firstName": "Jean",
      "lastName": "Doe",
      "email": "jean@example.cm",
      "skills": ["Python", "React"],
      "yearsExperience": "5"
    }
  }'
```

### 2. Mock Webhook Response (Test CV Reception)
```bash
curl -X POST http://localhost:3000/api/workflows/webhooks/cv-generated \
  -H "Content-Type: application/json" \
  -d '{
    "profileId": "test_profile_123",
    "cvContent": "# CV for Jean Doe\n...",
    "cvFormat": "markdown",
    "generatedAt": "2024-01-15T10:30:00Z"
  }'
```

### 3. Retrieve Generated CV
```bash
curl http://localhost:3000/api/workflows/webhooks/cv-generated?profileId=test_profile_123
```

## N8N Configuration

### CV Generator Webhook Setup
1. In N8N: Create HTTP Request node
2. URL: Your app's CV Generator endpoint
3. Send generated CV to: `/api/workflows/webhooks/cv-generated`

### Job Analyzer Webhook Setup
1. In N8N: Create HTTP Request node
2. Input: Profile + Job
3. Call Gemini API with comparison logic
4. Send results to: `/api/workflows/webhooks/job-analyzed`

### Application Sender Webhook Setup
1. In N8N: Create HTTP Request node
2. Input: Profile + CV + Job
3. Format and send application
4. Send confirmation to: `/api/workflows/webhooks/application-sent`

## Database Considerations

Currently, all results are stored in-memory. For production:

1. Replace `Map` storage with PostgreSQL/MongoDB
2. Add tables:
   - `generated_cvs` (profileId, jobId, cvContent, format)
   - `job_analyses` (profileId, jobId, matchPercentage, recommendation)
   - `applications` (profileId, jobId, status, sentAt)
3. Add indexing on profileId, jobId

## Error Handling

All endpoints return proper HTTP status codes:
- 200: Success
- 202: Accepted (async operation)
- 400: Bad Request (missing fields)
- 404: Not Found
- 500: Server Error

Check logs for debugging:
```bash
# Watch server logs
npm run dev
```

## Next Steps

1. Configure environment variables with your n8n webhook URLs
2. Set up n8n workflow nodes to call the API endpoints
3. Test with sample profiles
4. Connect to actual JobinCamer data
5. Implement database persistence
6. Add email notifications for application confirmations
