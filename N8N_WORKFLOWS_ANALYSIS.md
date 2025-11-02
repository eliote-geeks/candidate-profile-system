# n8n Workflows Analysis - 2025-11-02

## Overview
Two production workflows analyzed from the job automation system.

---

## WORKFLOW 1: Job Analysis (Gemini-Based Scoring)

### Purpose
Analyze job offers against candidate profiles and assign compatibility scores.

### Architecture Flow
```
Manual Trigger
    ↓
Get Jobs (10 max, status='collected')
    ↓
Jobs Found Check
    ├─ YES → Get Candidate (active=true, LIMIT 1)
    └─ NO → Exit with message
    ↓
Loop Jobs (split in batches)
    ↓
Prepare Prompt (build Gemini query)
    ↓
Gemini 2.0 Flash API (AI analysis)
    ↓
Parse (extract JSON scores)
    ↓
Update DB (store match_score, quality_score, etc.)
    ↓
Format Summary (aggregate results)
```

### Key Nodes & Their Function

| Node | Type | Purpose | Notes |
|------|------|---------|-------|
| **▶️ Test Manuel** | Manual Trigger | Start workflow manually | Good for testing |
| **📋 Get Jobs (10 max)** | PostgreSQL | Fetch 10 random uncollected jobs | `LIMIT 10` for cost control |
| **❓ Jobs Found?** | Conditional | Check if jobs exist | Routes to exit if empty |
| **👤 Get Candidate** | PostgreSQL | Get first active candidate | `LIMIT 1` for testing |
| **🔄 Loop Jobs** | Split in Batches | Iterate through jobs | Processes one by one |
| **📝 Prepare Prompt** | Code (JavaScript) | Build Gemini prompt | Dynamically creates analysis request |
| **🤖 Gemini Analysis** | LLM Chain | Call Gemini 2.0 Flash | Uses PaLM API credentials |
| **Gemini 1.5 Flash** | Model Config | Model definition | Free tier: 1500 req/day |
| **🔍 Parse** | Code (JavaScript) | Extract JSON from response | Error handling included |
| **💾 Update DB** | PostgreSQL | Store analysis results | Updates job_offers table |
| **📊 Get Analysis Results** | PostgreSQL | Fetch analyzed jobs | Reads back from DB |
| **📋 Format Summary** | Code (JavaScript) | Create summary stats | Logs results to console |

### Scoring Formula
```
overall_score = (
  match_score * 0.4 +        // 40% - How well skills match
  quality_score * 0.3 +       // 30% - How good the job offer is
  predicted_success * 0.2 +   // 20% - Probability of interview
  urgency_score * 0.1         // 10% - Time sensitivity
)
```

### Database Updates
**Table: `job_offers`**
- Sets: `match_score`, `urgency_score`, `quality_score`, `predicted_success_rate`, `status='analyzed'`
- Where: `id = '{{ job_id }}'::uuid`

### Gemini Prompt Example
```
Tu es un expert RH camerounais. Analyse cette offre pour ce candidat.

# CANDIDAT
Nom: Paul Kamgang
Poste: Senior Developer
Expérience: 5 ans
Compétences: React, Node.js, TypeScript, Python
Postes visés: Senior Developer, Tech Lead
Secteurs: Tech, Finance
Villes: Douala, Yaoundé
Salaire min: 500000 FCFA

# OFFRE
Titre: Senior Full-Stack Developer
Lieu: Douala
Contrat: CDI
...

# Réponds en JSON
{
  "match_score": 75,
  "urgency_score": 60,
  "quality_score": 80,
  "predicted_success": 70,
  ...
}
```

### Cost Analysis
- **API Used:** Google Gemini 2.0 Flash
- **Free Tier:** 1500 requests/day
- **Cost per request:** FREE (within quota)
- **Current Limit:** 10 jobs max per run
- **Estimated usage:** 10 requests/run × multiple runs/day = ✅ Within quota

### Potential Issues

#### ⚠️ ISSUE #1: Job Query SQL Syntax
**Location:** "📋 Get Jobs (10 max)" node
**Current SQL:**
```sql
SELECT * FROM job_offers WHERE status = 'collected' ORDER BY RANDOM() DESC LIMIT 10
```

**Problem:**
- Uses `RANDOM()` for ordering (inefficient with large datasets)
- Doesn't filter by date (could analyze very old jobs)
- Missing `shuffled` column if it exists

**Recommendation:**
```sql
SELECT * FROM job_offers
WHERE status = 'collected'
  AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY RANDOM()
LIMIT 10
```

#### ⚠️ ISSUE #2: Candidate Query Too Restrictive
**Location:** "👤 Get Candidate" node
**Current SQL:**
```sql
SELECT * FROM candidates WHERE active = true LIMIT 1
```

**Problem:**
- Only analyzes jobs for FIRST candidate
- Should loop through multiple candidates
- Workflow title suggests it should handle multiple candidates

**Better approach:**
```sql
SELECT * FROM candidates
WHERE active = true
  AND id NOT IN (
    SELECT DISTINCT candidate_id FROM applications
    WHERE DATE(sent_at) = CURRENT_DATE
  )
LIMIT 3
```

#### ⚠️ ISSUE #3: JSON Parse Error Handling
**Location:** "🔍 Parse" node
**Problem:**
- Fallback returns 50% scores for all errors
- Doesn't log which job failed
- Could mask real API issues

**Improvement:**
```javascript
catch (error) {
  console.error(`❌ Parse error for job ${jobId}:`, error.message);
  throw error; // Let workflow fail loudly instead of hiding
}
```

#### ⚠️ ISSUE #4: Database Connection Retry
**Location:** All PostgreSQL nodes
**Problem:**
- No retry logic if connection drops
- Could fail silently in UPDATE DB node

**Recommendation:** Add retry configuration to PostgreSQL nodes

#### ⚠️ ISSUE #5: Credential Hardcoding
**Locations:**
- PostgreSQL: `"id": "RCIgOlmToK7XFEry"` (job_automation_db)
- Gemini: `"id": "PepWLlqdzrgXrBqv"` (Google Gemini API)

**Problem:**
- Credentials are hardcoded by ID
- If credentials change, workflow breaks
- Should use environment variables

---

## WORKFLOW 2: Application Sender (Email + PDF CV)

### Purpose
Send job applications with personalized cover letters and CV PDFs via email.

### Architecture Flow
```
Manual Trigger
    ↓
Check Quota (daily email limit)
    ↓
Quota OK?
    ├─ YES → Get Jobs (score ≥70, has CV, not applied yet)
    └─ NO → Quota Exceeded error
    ↓
Jobs Found?
    ├─ YES → Get Candidate (active=true)
    └─ NO → No Jobs message
    ↓
Merge Jobs & Candidate (combine data)
    ↓
Loop Each Application (split in batches)
    ↓
Prepare Data (format for email)
    ↓
Build Prompt (for cover letter generation)
    ↓
Generate Cover Letter (Gemini 2.0 Flash)
    ↓
Parse Letter (extract text)
    ↓
Get CV (fetch from documents table)
    ↓
Prepare PDF Data (format for conversion)
    ↓
Prepare HTML Binary (encode HTML)
    ↓
Convert to PDF (via Gotenberg service)
    ↓
Prepare Email (build email payload)
    ↓
Send Email (Gmail API)
    ↓
Create Application (DB record)
    ↓
Log Email (audit trail)
    ↓
Log Success (console summary)
    ↓
Loop (next application)
    ↓
Get Results (fetch recent applications)
    ↓
Format Summary (final stats)
```

### Key Nodes & Their Function

| Node | Type | Purpose | Notes |
|------|------|---------|-------|
| **Manual Trigger** | Manual | Start workflow | Good for testing |
| **Check Quota** | PostgreSQL | Call `init_daily_quota()` | Manages email limits |
| **Quota OK?** | Conditional | Check remaining quota | Prevents over-sending |
| **Get Jobs** | PostgreSQL | Fetch sendable jobs | Complex filter criteria |
| **Get Candidate** | PostgreSQL | Get candidate | Limit 1 (ISSUE!) |
| **Merge Jobs & Candidate** | Code | Combine data | Maps fields for later nodes |
| **Loop Each Application** | Split Batches | Iterate jobs | One email per loop |
| **Prepare Data** | Code | Format for Gemini | Builds context |
| **Build Prompt** | Code | Create cover letter prompt | Includes A/B variant |
| **Generate Cover Letter** | LLM Chain | Gemini 2.0 Flash | 250-350 word letters |
| **Parse Letter** | Code | Extract from response | Validates length |
| **Get CV** | PostgreSQL | Fetch CV document | By job_offer_id |
| **Prepare PDF Data** | Code | Format for Gotenberg | Extracts HTML content |
| **Prepare HTML Binary** | Code | Encode HTML as binary | Base64 encode |
| **Convert to PDF** | HTTP POST | Gotenberg service | HTML → PDF conversion |
| **Prepare Email** | Code | Build email object | Add subject, body, CV |
| **Send Email** | Gmail | Send via Gmail API | Attachments included |
| **Create Application** | PostgreSQL | Record application | Insert with follow-up date |
| **Log Email** | PostgreSQL | Audit trail | Track sent emails |
| **Log Success** | Code | Print console log | For monitoring |
| **Loop** | NoOp | Loop back | Prepare for next batch |
| **Get Results** | PostgreSQL | Fetch sent apps | From last 5 minutes |
| **Format Summary** | Code | Final stats | Total sent, job titles |

### Job Selection Query
```sql
SELECT
  jo.id, jo.title, jo.description, jo.location, jo.contract_type,
  jo.salary_min, jo.salary_max, jo.required_skills, jo.required_experience,
  jo.education_required, jo.source_platform, jo.company_id,
  jo.match_score, jo.quality_score, jo.predicted_success_rate,
  c.name as company_name, c.hr_email as company_email
FROM job_offers jo
LEFT JOIN companies c ON jo.company_id = c.id
WHERE jo.status = 'analyzed'
  AND jo.match_score >= 70               -- High match only
  AND EXISTS (
    SELECT 1 FROM documents d
    WHERE d.job_offer_id = jo.id AND d.type = 'cv'  -- Must have CV
  )
  AND NOT EXISTS (
    SELECT 1 FROM applications a
    WHERE a.job_offer_id = jo.id          -- Not already applied
  )
ORDER BY (jo.match_score * 0.4 + jo.quality_score * 0.3 + jo.predicted_success_rate * 0.2) DESC
LIMIT 10
```

### Cover Letter Generation
- **Model:** Gemini 2.0 Flash Exp (experimental)
- **Length:** 250-350 words
- **A/B Testing:** Two styles
  - Variant A: Professional, structured
  - Variant B: Dynamic, storytelling
- **Temperature:** 0.7 (creative, not random)
- **Max tokens:** 1000

### Email Sending
- **Service:** Gmail API
- **Default recipient:** `job_company_email` (or test mode: `pauleliote97@gmail.com`)
- **Attachments:** CV PDF
- **Test Mode:** `TEST_MODE = true` (currently sends to test email)

### PDF Conversion Pipeline
1. Get CV HTML from documents table
2. Encode as binary (Base64)
3. POST to Gotenberg service: `http://gotenberg-pdf-service:3000/forms/chromium/convert/html`
4. Receive PDF binary
5. Attach to email

### Database Operations
**Table: `applications`** (insert)
- `candidate_id`, `job_offer_id`, `cv_version`, `cv_url`
- `email_subject`, `email_body`, `sent_to_email`
- `sent_at`, `optimal_time`, `status`, `next_follow_up_date`

**Table: `emails`** (insert for audit)
- `application_id`, `direction='outgoing'`
- `subject`, `body`, `from_email`, `to_email`, `sent_at`

**Quota system:**
- Function: `init_daily_quota()` - Initialize daily limit
- Function: `increment_email_sent()` - Increment sent count

### Cost Analysis
- **Gemini API:** 1500 req/day (free tier)
- **Gmail API:** Unlimited (for registered apps)
- **Gotenberg Service:** Self-hosted, no cost
- **Current Limit:** 10 applications per run
- **Email Quota:** 50/month (per `email_quota` table)

### Potential Issues

#### ⚠️ ISSUE #1: Test Mode Still Active
**Location:** "Prepare Email" node (line: `const TEST_MODE = true`)
**Problem:**
- All emails go to `pauleliote97@gmail.com` instead of real recruiter email
- Production data but test recipients = no real applications

**Fix:**
```javascript
const TEST_MODE = false; // Or load from environment variable
```

#### ⚠️ ISSUE #2: Single Candidate Per Run
**Location:** "Get Candidate" node
```sql
SELECT * FROM candidates WHERE active = true LIMIT 1
```

**Problem:**
- Workflow designed for 1 candidate but title suggests "applications sender"
- Should process multiple candidates
- Wastes Gemini API quota

**Better:**
```sql
SELECT * FROM candidates
WHERE active = true
LIMIT 3 -- Process 3 candidates per run
```

Then add another Loop for candidates.

#### ⚠️ ISSUE #3: CV Retrieval Assumes Existence
**Location:** "Get CV" node
**Problem:**
- Query fetches CV but no error if not found
- `alwaysOutputData: true` means empty results pass through
- "Get CV" check later fails

**Fix:**
```javascript
// In Parse Letter node
if (!cvData.content) {
  throw new Error('CV not found for job_id: ' + previousData.job_id);
}
```

Already exists in code but should happen earlier.

#### ⚠️ ISSUE #4: Gotenberg Service Dependency
**Location:** "Convert to PDF" node
**Problem:**
- Hardcoded URL: `http://gotenberg-pdf-service:3000`
- Service must be running on Docker network
- If service down, workflow fails with no fallback

**Recommendation:**
- Add error handling
- Could fallback to text attachment if PDF fails
- Or retry with exponential backoff

#### ⚠️ ISSUE #5: Gmail Credentials May Expire
**Location:** "Send Email" node
**Credentials:** `"id": "T8c1dFOYu86WaZxZ"` (Gmail account 2)
**Problem:**
- OAuth2 tokens expire
- Workflow could fail if token refreshed but credential ID stale
- No error handling shown

#### ⚠️ ISSUE #6: Email Quota Not Updated in Real-Time
**Location:** "Log Email" node
**Problem:**
- Calls `increment_email_sent()` but no validation
- If quota already exceeded, still sends email
- Race condition possible with concurrent runs

**Better:**
```sql
-- Before sending email, verify quota AGAIN
SELECT * FROM email_quota
WHERE date = CURRENT_DATE
  AND emails_sent < daily_limit
FOR UPDATE;
```

#### ⚠️ ISSUE #7: No Follow-up Scheduling
**Location:** "Create Application" node
**Problem:**
- Sets `next_follow_up_date = NOW() + INTERVAL '7 days'`
- But no workflow to actually send follow-ups
- Left in database unused

#### ⚠️ ISSUE #8: Error in SQL Syntax
**Location:** "Create Application" node
**Problem:**
```sql
... NOW() - INTERVAL '7 days') RETURNING id, ...
```
Should be `+` not `-` for future date

---

## Integration Issues with Fixed Code

### Issue A: Candidate Profile Format Mismatch
**Fixed Code:** Uses snake_case in database, camelCase in API responses
**Workflow Code:** Uses snake_case directly from PostgreSQL

**Impact:** NONE - Workflows read directly from DB tables (snake_case)

**Status:** ✅ Compatible

### Issue B: Field Names in Prompts
**Workflow 1** builds Gemini prompts with field names like:
- `candidate.first_name`, `candidate.years_experience`

**Fixed Code** now returns camelCase from API but workflows bypass API (direct DB access)

**Status:** ✅ Compatible (workflows don't use API)

### Issue C: Candidate ID Consistency
Both workflows use UUIDs for `candidate_id`

**Status:** ✅ Compatible

---

## Recommendations

### Priority 1: Critical (Fix Before Production)

1. **Disable Test Mode** in Application Sender
   - Change `const TEST_MODE = false`
   - Or read from environment: `const TEST_MODE = process.env.N8N_TEST_MODE === 'true'`

2. **Add Gotenberg Error Handling**
   - HTTP request should retry on failure
   - Or fallback to email without PDF

3. **Fix SQL Date Calculation**
   - Line in "Create Application": `NOW() + INTERVAL '7 days'` ✅ Already correct

### Priority 2: High (Improve Before Scaling)

1. **Support Multiple Candidates**
   - Add outer loop for candidates
   - Process 3-5 candidates per run

2. **Improve Job Query** in Analysis workflow
   - Add date filter: `created_at >= NOW() - INTERVAL '30 days'`
   - Better randomization

3. **Add Retry Logic**
   - PostgreSQL nodes should retry
   - Gemini API calls should retry

### Priority 3: Medium (Nice to Have)

1. **Add Monitoring/Alerts**
   - Webhook to Slack for failures
   - Email summary after each run

2. **Implement Follow-up Workflow**
   - Separate workflow that sends follow-ups
   - Uses `applications.next_follow_up_date`

3. **Add A/B Testing Analytics**
   - Track which variant performs better
   - Store variant in applications table (already done!)

---

## Deployment Checklist

- [ ] Test Mode: `const TEST_MODE = false`
- [ ] Credentials verified (PostgreSQL, Gemini, Gmail)
- [ ] Gotenberg service running on Docker
- [ ] Email quota table initialized
- [ ] Candidate profiles fully populated
- [ ] Job offers in 'analyzed' status exist
- [ ] CVs generated and stored in documents table
- [ ] Gmail account has "Less secure apps" enabled OR OAuth2 set up
- [ ] n8n workflow active and scheduled
- [ ] Error notifications configured

---

---

## WORKFLOW 3: Job Scraping (Firecrawl - JobinCamer)

### Purpose
Scrape job listings from JobinCamer website and store them in the database.

### Architecture Flow
```
Manual Trigger
    ↓
Get Candidate Profile (context for filtering)
    ↓
Source: JobinCamer (set source URL)
    ↓
Scrape Listing Page (Firecrawl API)
    ↓
Parse Job Listing Page (extract job links)
    ↓
Parse Job List (split in batches)
    ↓
Scrape Job Detail Page (Firecrawl API)
    ↓
Extract Job Details (parse HTML/markdown)
    ↓
Check Duplicate (query by source_url)
    ↓
Is New? (conditional)
    ├─ YES → Insert Job with Details
    └─ NO → Skip Duplicate
    ↓
Loop back (next job)
    ↓
Get Results (fetch scraped jobs from DB)
    ↓
Summary (final stats)
```

### Key Nodes & Function

| Node | Type | Purpose | Notes |
|------|------|---------|-------|
| **▶️ Manual Test** | Manual Trigger | Start workflow | For testing |
| **👤 Get Candidate Profile** | PostgreSQL | Get first active candidate | For context (not directly used) |
| **📌 Source: JobinCamer** | Set | Set source URL and platform | Hardcoded: JobinCamer |
| **🔥 Scrape Listing Page** | HTTP POST | Call Firecrawl API | Scrapes listing page |
| **🔍 Parse Job Listing Page** | Code | Extract job links from HTML | Complex regex patterns |
| **🔍 Parse Job List** | Split Batches | Iterate through extracted jobs | One job per batch |
| **🔥 Scrape Job Detail Page** | HTTP POST | Firecrawl scrapes detail page | Gets full job info |
| **📝 Extract Job Details** | Code | Parse HTML for details | Extracts 5+ fields |
| **🔎 Check Duplicate** | PostgreSQL | Query by source_url | Prevents duplicates |
| **❓ Is New?** | Conditional | Check if job exists | Routes to insert or skip |
| **💾 Insert Job with Details** | PostgreSQL | Upsert job to database | Uses CONFLICT clause |
| **⏭️ Skip Duplicate** | Code | Log skipped job | Counts duplicates |
| **🔁 Loop Back** | NoOp | Loop back for next job | Batch processing |
| **📊 Get Results** | PostgreSQL | Fetch jobs from last 10 mins | From job_offers table |
| **📋 Summary** | Code | Generate summary stats | Logs results |

### Firecrawl Integration
- **Service:** Firecrawl API (web scraping service)
- **API Key:** `Bearer fc-c9fc7a4ac2f543e6893b3daccb0845b5` (hardcoded)
- **Cost:** Charged per request (not free tier)
- **Timeout:** 180 seconds (3 minutes)
- **Formats:** HTML + Markdown extraction
- **Target:** JobinCamer.com

### Job Filtering & Extraction

**Blacklist Patterns** (links to skip):
- `/dashboard`, `/blogs`, `/blog/`, `/category`
- `/entreprises`, `/employers`, `/companies`
- `/post`, `/posts`, `forum`, `publicité`
- `javascript:`, `mailto:`, `tel:`
- Plus 20+ autres patterns

**Whitelist Patterns** (accept job links):
- Contains `/job/`, `/offre/`, `/emploi/`, `/vacancy/`, `/poste/`
- OR title contains job keywords (recrute, offre, emploi, stage, etc.)

**Extraction Fields:**
1. Title
2. Location (default: "Cameroun")
3. Source URL
4. Posted Date (from page context)
5. Deadline Date
6. Required Experience
7. Contract Type (CDI/CDD/Stage/Freelance)
8. Description (1500+ chars)
9. Required Skills (extracted keywords)
10. Recruiter Email
11. Recruiter Name
12. Salary Range (min/max)

### Database Insert
**Table: `job_offers`**
```sql
INSERT INTO job_offers (
  title, company_id, description, location, contract_type,
  required_experience, source_platform, source_url, posted_date,
  deadline_date, scraped_at, status
) VALUES (...)
ON CONFLICT (source_url) DO UPDATE SET
  description = EXCLUDED.description,
  deadline_date = COALESCE(EXCLUDED.deadline_date, job_offers.deadline_date),
  required_experience = EXCLUDED.required_experience,
  contract_type = EXCLUDED.contract_type,
  updated_at = NOW()
```

### Potential Issues

#### ⚠️ ISSUE #1: Firecrawl API Key Hardcoded
**Location:** "🔥 Scrape Listing Page" and "🔥 Scrape Job Detail Page"
**Problem:**
- API key visible in workflow: `Bearer fc-c9fc7a4ac2f543e6893b3daccb0845b5`
- Security risk if workflow exported/shared
- Key could be revoked or rate-limited

**Fix:**
- Store in environment variable: `process.env.FIRECRAWL_API_KEY`
- Or n8n credential storage

#### ⚠️ ISSUE #2: Expensive API Calls
**Location:** Every job detail page calls Firecrawl
**Problem:**
- ~50 jobs per run × 2 API calls (listing + detail) = 100 requests/run
- Cost adds up quickly
- No rate limiting shown

**Recommendation:**
- Cache results (don't re-scrape same URL)
- Implement retry with exponential backoff
- Add daily/monthly quota tracking

#### ⚠️ ISSUE #3: Regex Parsing Fragile
**Location:** "🔍 Parse Job List" and "📝 Extract Job Details"
**Problem:**
- HTML structure parsing depends on JobinCamer website format
- If website redesigns, workflow breaks
- Regex patterns are complex and error-prone

**Better Approach:**
- Use Firecrawl's "target selector" feature (if available)
- Or switch to web scraping library (Puppeteer, Selenium)

#### ⚠️ ISSUE #4: No Error Handling
**Location:** HTTP request nodes
**Problem:**
- If Firecrawl API fails, workflow stops
- No retry logic
- No fallback

**Add:**
- Retry configuration on HTTP nodes
- Error webhook notification

#### ⚠️ ISSUE #5: Candidate Profile Fetched But Not Used
**Location:** "👤 Get Candidate Profile" node
**Problem:**
- Query executed but data not used in workflow
- Unnecessary database call
- Could be removed

---

## WORKFLOW 4: CV Generation (Gemini)

### Purpose
Generate personalized CVs for candidates targeting specific jobs using AI.

### Architecture Flow
```
Manual Trigger
    ↓
Get Jobs to Generate CVs (match_score >= 15%)
    ↓
Jobs Found?
    ├─ YES → Get Candidate (active, random)
    └─ NO → Exit
    ↓
Loop Jobs (split in batches)
    ├─ Read from DB
    └─ Read CVs from DB
    ↓
Prepare CV Data (combine job + candidate)
    ↓
Build Prompt (create Gemini request)
    ↓
Generate CV (Gemini 2.0 Flash)
    ↓
Extract CV (clean HTML)
    ↓
Save CV to DB (documents table)
    ↓
Track A/B Test (log variant)
    ↓
Loop (next job)
    ↓
Get CVs from DB (fetch generated CVs)
    ↓
Format Summary (final stats)
```

### Key Nodes & Function

| Node | Type | Purpose | Notes |
|------|------|---------|-------|
| **▶️ Test Manuel** | Manual Trigger | Start workflow | For testing |
| **🎯 Get Jobs to Generate CVs** | PostgreSQL | Fetch analyzed jobs | `match_score >= 15`, no applications yet |
| **❓ Jobs Found?** | Conditional | Check if jobs exist | Routes to exit if none |
| **🚫 Exit** | Set | Exit message | "No jobs needing CV" |
| **👤 Get Candidate** | PostgreSQL | Random active candidate | LIMIT 1 |
| **🔄 Loop Jobs** | Split Batches | Iterate through jobs | One CV per job |
| **📋 Prepare CV Data** | Code | Merge job + candidate data | A/B variant selection |
| **✍️ Build Prompt** | Code | Create Gemini prompt | Style depends on variant |
| **🤖 Generate CV** | LLM Chain | Call Gemini with prompt | HTML output |
| **Gemini 1.5 Flash** | Model Config | Model definition | 4000 max tokens |
| **📄 Extract CV** | Code | Clean HTML, generate filename | Base64 encoding |
| **💾 Save CV to DB** | PostgreSQL | Insert into documents table | Stores HTML content |
| **🧪 Track A/B Test** | PostgreSQL | Simple logging | Tracks variant used |
| **🔁 Loop** | NoOp | Loop back | Next job |
| **📊 Get CVs from DB** | PostgreSQL | Fetch generated CVs | Last 5 minutes |
| **📋 Format Summary** | Code | Summary stats | Variant A/B counts |

### CV Generation Features

**A/B Testing:**
- Variant A: Professional, structured (50% chance)
- Variant B: Modern, storytelling-focused (50% chance)
- Tracked in `documents.version` field

**Generated CV Structure:**
1. Header (name, contact, title)
2. Profile summary (2-3 sentences, job-specific)
3. Experience (2+ positions with achievements)
4. Education
5. Skills (by category, matching job requirements)
6. Languages

**Prompt Optimization:**
- Adapts to Cameroonian job market
- Highlights relevant skills for each job
- Uses ATS-friendly keyword formatting
- Customizes experience descriptions

**Configuration:**
- Model: Gemini 2.0 Flash
- Max tokens: 4000
- Temperature: default (deterministic)

### Database Operations

**Table: `documents`** (insert)
```sql
INSERT INTO documents (
  candidate_id,
  job_offer_id,
  type='cv',
  content='{html}',
  file_path='/cvs/{filename}',
  version='A' or 'B'
)
```

**Job Selection Query:**
```sql
SELECT * FROM job_offers
WHERE status = 'analyzed'
  AND match_score >= 15
  AND id NOT IN (
    SELECT job_offer_id FROM applications
    WHERE job_offer_id IS NOT NULL
  )
ORDER BY RANDOM()
LIMIT 3
```

### Potential Issues

#### ⚠️ ISSUE #1: Single Candidate Per Run
**Location:** "👤 Get Candidate" node
**Problem:**
- Only processes one random candidate
- Should generate CVs for multiple candidates
- Inefficient use of API quota

**Better:**
```sql
SELECT * FROM candidates
WHERE active = true
LIMIT 5 -- Generate for 5 candidates per run
```

#### ⚠️ ISSUE #2: A/B Test Tracking Incomplete
**Location:** "🧪 Track A/B Test" node
**Problem:**
- Comment says "simplifié pour l'instant"
- Only logs to console, doesn't actually track
- `ab_tests` table exists but not used
- Can't analyze which variant performs better

**Better:**
```sql
INSERT INTO ab_tests (
  candidate_id, test_name, test_type,
  variant_a, variant_b, winning_variant, status
) VALUES (...)
```

#### ⚠️ ISSUE #3: No Validation of Generated HTML
**Location:** "📄 Extract CV" node
**Problem:**
- Assumes Gemini always returns valid HTML
- No error checking
- Could store malformed HTML in DB

**Add Validation:**
```javascript
if (!cvHtml.includes('<html') && !cvHtml.includes('<div')) {
  throw new Error('Invalid HTML generated');
}
```

#### ⚠️ ISSUE #4: File Path Not Actual Storage
**Location:** "💾 Save CV to DB"
**Problem:**
- `file_path` is `/cvs/{filename}` (URL path, not file system path)
- HTML stored in `content` field (database)
- No actual file created on disk
- If need to serve PDFs, this won't work

**Note:** This might be intentional (store in DB instead of file system)

#### ⚠️ ISSUE #5: Job Selection Too Permissive
**Location:** "🎯 Get Jobs to Generate CVs"
**Problem:**
- Selects ALL jobs with `match_score >= 15` (very low threshold)
- `RANDOM()` could generate CVs for low-quality jobs
- Should prioritize better matches

**Better:**
```sql
SELECT * FROM job_offers
WHERE status = 'analyzed'
  AND match_score >= 70  -- Higher threshold
  AND NOT EXISTS (
    SELECT 1 FROM documents
    WHERE job_offer_id = job_offers.id
      AND type = 'cv'
  )
ORDER BY match_score DESC
LIMIT 3
```

---

## Cross-Workflow Integration Issues

### Issue A: Workflow 2 Depends on Workflow 4
**Dependency:** Application Sender needs CVs from CV Generator
**Problem:**
- Workflow 4 generates CVs on demand
- Workflow 2 sends applications and attaches CVs
- If Workflow 4 hasn't run, no CVs available

**Solution:**
- Ensure Workflow 4 runs before Workflow 2
- Or modify Workflow 2 to generate CV if missing
- Use workflow scheduling/triggers

### Issue B: Workflow 3 Data Quality
**Impact:** Workflows 1, 2, 4 depend on jobs from Workflow 3
**Problem:**
- Workflow 3 scrapes web (unreliable)
- Data quality varies
- Malformed descriptions impact Workflow 1 (Gemini analysis)

**Solution:**
- Add data validation in Workflow 3
- Clean/normalize text before inserting
- Mark low-quality jobs with flag

### Issue C: Candidate Data Consistency
**Problem:**
- All workflows query candidate profiles
- If candidate profile is incomplete, workflows may fail
- No validation that required fields exist

**Solution:**
- Add pre-checks: ensure `first_name`, `email`, `skills` exist
- Use same profile evaluation as API (see `profileCompletion.ts`)

---

## Summary of All 4 Workflows

| Workflow | Purpose | Trigger | Frequency | Cost |
|----------|---------|---------|-----------|------|
| **#1: Job Analysis** | Score jobs with Gemini AI | Manual | On-demand | Gemini API (~free quota) |
| **#2: Application Sender** | Send applications via Gmail | Manual | On-demand | Gmail free, PDF service |
| **#3: Job Scraping** | Collect jobs from JobinCamer | Manual | On-demand | Firecrawl API (pay-per-request) |
| **#4: CV Generation** | Generate personalized CVs | Manual | On-demand | Gemini API (~free quota) |

### Recommended Execution Order
```
1. Workflow 3 (Scraping) → Collect new jobs
2. Workflow 1 (Analysis) → Score collected jobs
3. Workflow 4 (CV Generation) → Generate CVs for good matches
4. Workflow 2 (Sender) → Send applications with CVs
```

### Automation Potential
Currently all workflows are **manual trigger**. Could be automated with:
- **Schedule:** Cron jobs (daily scraping at 2 AM, weekly applications)
- **Webhooks:** Trigger when candidate profile updated
- **Events:** Trigger when job reaches match_score >= 70

---

*Analysis completed: 2025-11-02*
*Status: All 4 workflows analyzed - Ready for optimization*
