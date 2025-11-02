# Database Setup Guide

## Prerequisites

- PostgreSQL 12+ installed and running
- Node.js 18+
- `.env.local` file with DATABASE_URL

## 1. Install Dependencies

```bash
npm install @prisma/client prisma
```

## 2. Configure Database URL

Create or update `.env.local` with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/candidate_db"
```

Example with default PostgreSQL:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/candidate_db"
```

## 3. Create Database

```bash
# Create the database if it doesn't exist
psql -U postgres -c "CREATE DATABASE candidate_db;"
```

## 4. Run Prisma Migrations

Initialize Prisma and create all tables:

```bash
# Generate Prisma Client
npx prisma generate

# Create all tables from schema
npx prisma migrate deploy

# Or for development with auto-create:
npx prisma db push
```

## 5. View Database (Optional)

Open Prisma Studio to view/manage data:

```bash
npx prisma studio
```

This opens http://localhost:5555 in your browser.

## Database Schema Overview

### Core Tables

#### **CandidateProfile** (Candidates)
```sql
- id (CUID - Primary Key)
- firstName, lastName, email (unique), phone
- location, country (default: Cameroon)
- Professional: currentTitle, yearsExperience, sector
- Education: degree, institution, fieldOfStudy, graduationYear
- Skills: skills[], technicalSkills[], softSkills[], languages[]
- Preferences: desiredPositions[], desiredLocations[], salary range
- CV Data: summary, workExperience[], achievements[]
- Search Prefs: noticePeriod, remoteWork, relocateWilling, priority
- Timestamps: createdAt, updatedAt
```

#### **WorkExperience** (Job History)
```sql
- id (CUID - Primary Key)
- profileId (Foreign Key)
- company, position, duration, description
- startDate, endDate
```

#### **JobOffer** (Job Listings)
```sql
- id (CUID - Primary Key)
- title, company, description, location, salary
- requiredSkills[], sector, contractType
- link, source (jobincamer, linkedin, etc)
- postedDate
- createdAt
```

#### **GeneratedCV** (Stored CVs)
```sql
- id (CUID - Primary Key)
- profileId (Foreign Key)
- jobId (Foreign Key - optional, for tailored CVs)
- cvContent (Text - Full CV content)
- cvFormat (json, markdown, html)
- compatibilityScore (0-100)
- status (pending, completed, failed)
- workflowId, errorMessage
- createdAt
```

#### **JobAnalysis** (Match Analysis)
```sql
- id (CUID - Primary Key)
- profileId, jobId (Foreign Keys)
- matchPercentage (0-100)
- matchedSkills[], missingSkills[]
- salaryMatch, locationMatch (boolean)
- analysis (Text)
- recommendation (high_priority, apply, maybe, skip)
- status, workflowId
- createdAt
```

#### **JobApplication** (Application Tracking)
```sql
- id (CUID - Primary Key)
- profileId, jobId (Foreign Keys)
- status (pending, sent, viewed, rejected, interview, accepted)
- sentAt, viewedAt, respondedAt (timestamps)
- cvId (optional reference to GeneratedCV)
- motivationLetter, confirmationUrl
- workflowId, errorMessage
- createdAt, updatedAt
```

#### **AuditLog** (Activity Tracking)
```sql
- id (CUID - Primary Key)
- profileId (Foreign Key)
- action (profile_created, cv_generated, job_analyzed, application_sent)
- details (JSON - flexible audit data)
- ipAddress, userAgent
- createdAt
```

## Indexes for Performance

The schema includes indexes on frequently queried fields:
- `CandidateProfile.email` (unique)
- `CandidateProfile.createdAt`
- `GeneratedCV.profileId`, `jobId`
- `JobAnalysis.matchPercentage`, `recommendation`
- `JobApplication.status`, `sentAt`
- `AuditLog.profileId`, `action`

## Relations & Foreign Keys

```
CandidateProfile (1) ---> (N) WorkExperience
CandidateProfile (1) ---> (N) GeneratedCV
CandidateProfile (1) ---> (N) JobAnalysis
CandidateProfile (1) ---> (N) JobApplication
CandidateProfile (1) ---> (N) AuditLog

JobOffer (1) ---> (N) GeneratedCV
JobOffer (1) ---> (N) JobAnalysis
JobOffer (1) ---> (N) JobApplication
```

## Example Data

### Create a Sample Profile

```bash
npx prisma db seed
```

Or manually via API:

```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Nkomo",
    "email": "jean.nkomo@example.cm",
    "phone": "+237612345678",
    "location": "Douala",
    "currentTitle": "Senior Developer",
    "yearsExperience": "5",
    "skills": ["Python", "React", "PostgreSQL"],
    "technicalSkills": ["JavaScript", "TypeScript", "Node.js"],
    "languages": ["French", "English"],
    "desiredPositions": ["Full Stack Developer", "Tech Lead"],
    "minSalary": "500000",
    "maxSalary": "1500000",
    "contractTypes": ["CDI"]
  }'
```

## Backups

### Create Backup
```bash
pg_dump -U postgres candidate_db > backup.sql
```

### Restore Backup
```bash
psql -U postgres candidate_db < backup.sql
```

## Migration Workflow

### Generate Migration After Schema Changes

```bash
# After editing prisma/schema.prisma
npx prisma migrate dev --name <migration_name>
```

Example:
```bash
npx prisma migrate dev --name add_job_offers_table
```

### Reset Database (Development Only)

```bash
# ⚠️ Warning: This deletes all data!
npx prisma migrate reset
```

## Troubleshooting

### Connection Issues

1. **Connection refused**
   - Ensure PostgreSQL is running: `psql --version`
   - Check DATABASE_URL is correct
   - Verify user/password credentials

2. **Database doesn't exist**
   ```bash
   createdb -U postgres candidate_db
   ```

3. **Migration conflicts**
   ```bash
   npx prisma migrate resolve --rolled-back <migration_name>
   ```

## Production Considerations

1. **Use strong passwords** for PostgreSQL users
2. **Enable SSL/TLS** for remote connections
3. **Set up automated backups**
4. **Use read replicas** for high traffic
5. **Monitor connection pool** limits
6. **Archive old audit logs** for compliance

## Environment Variables

```env
# Local development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/candidate_db"

# Production (adjust to your hosting)
DATABASE_URL="postgresql://user:password@prod-db.example.com:5432/candidate_db"

# Optional: Connection pooling (for serverless)
DATABASE_URL="postgresql://user:password@db.example.com:5432/db?schema=public&poolingMode=transaction"
```

## Next Steps

1. Run migrations: `npx prisma migrate deploy`
2. Start dev server: `npm run dev`
3. Test API endpoints
4. Configure n8n webhooks
5. Monitor audit logs
