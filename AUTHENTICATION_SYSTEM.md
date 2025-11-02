# Système d'Authentification et Gestion de Profil

## Vue d'ensemble

Ce document décrit l'architecture complète du système d'authentification et de gestion de profil utilisateur pour RecruitAI. Le système est conçu pour:

1. **Authentification sécurisée** - Login/Register avec JWT tokens
2. **Gestion de profil** - CRUD complet pour les profils utilisateurs
3. **Contrôle des demandes** - Empêcher les doublons de candidatures
4. **Limitation de quota** - Contrôler le nombre de candidatures par jour
5. **Intégration workflows** - Connexion avec n8n pour l'automatisation

---

## Architecture

### Couches

```
Frontend (Next.js Pages/Components)
    ↓
API Routes (app/api)
    ↓
Services (lib/services)
    ↓
Database (Prisma)
    ↓
Workflows (n8n)
```

---

## Types TypeScript

Tous les types sont définis dans le dossier `types/`:

### 1. **types/auth.ts**
Gère l'authentification et les sessions

```typescript
interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  is_verified: boolean
  is_active: boolean
}

interface AuthSession {
  user: User
  access_token: string
  refresh_token: string
  expires_at: Date
}
```

### 2. **types/profile.ts**
Gère les profils candidats et leurs demandes

```typescript
interface CandidateProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  skills: string[]
  desired_positions: string[]
  applications_history: ApplicationHistoryEntry[]
}

interface ApplicationSummary {
  total_sent: number
  total_opened: number
  total_replied: number
  interviews_scheduled: number
  offers_received: number
}
```

### 3. **types/workflow.ts**
Gère l'intégration avec les workflows n8n

```typescript
interface CVGeneratorRequest {
  candidate_id: string
  job_offer_id: string
  template?: string
}

interface JobAnalyzerRequest {
  job_offer_id: string
  candidate_id: string
}

interface ApplicationSenderRequest {
  candidate_id: string
  job_offer_id: string
  use_workflow_automation: boolean
}
```

### 4. **types/api.ts**
Types pour les requêtes/réponses API

### 5. **types/entities.ts**
Types alignés avec le schéma Prisma

---

## Flux d'Authentification

### 1. Inscription (Register)

```
User → POST /api/auth/register
  {
    email: "user@example.com",
    password: "secure123",
    first_name: "Jean",
    last_name: "Dupont"
  }
    ↓
API Route Validation
    ↓
Hash password (bcrypt)
    ↓
Create User + Session
    ↓
Send verification email
    ↓
Return access_token + refresh_token
```

### 2. Connexion (Login)

```
User → POST /api/auth/login
  {
    email: "user@example.com",
    password: "secure123"
  }
    ↓
Validate credentials
    ↓
Create Session
    ↓
Return access_token + refresh_token
```

### 3. Vérification Email

```
User clicks link → GET /api/auth/verify-email?token=xyz
    ↓
Validate token
    ↓
Mark user as verified
    ↓
Redirect to dashboard
```

### 4. Rafraîchissement Token

```
Client → POST /api/auth/refresh
  {
    refresh_token: "old_token"
  }
    ↓
Validate refresh token
    ↓
Generate new access_token
    ↓
Return new token
```

---

## Flux de Gestion de Profil

### 1. Récupérer le Profil

```
GET /api/profile (avec Authorization header)
    ↓
Validate token
    ↓
Get candidate from DB
    ↓
Return profile + stats
```

### 2. Mettre à jour le Profil

```
PUT /api/profile
  {
    first_name?: "Nouveau",
    skills?: ["JavaScript", "Python"],
    desired_positions?: ["Senior Developer"]
  }
    ↓
Validate request
    ↓
Update in DB
    ↓
Return updated profile
```

### 3. Récupérer l'Historique des Candidatures

```
GET /api/profile/applications?status=sent&page=1
    ↓
Query applications from DB
    ↓
Return paginated results
    ↓
Include job details + status
```

---

## Flux de Contrôle des Doublons

### 1. Vérifier si candidature déjà envoyée

```
User → POST /api/duplicate-check
  {
    candidate_id: "uuid",
    job_offer_id: "uuid"
  }
    ↓
Check unique constraint:
  (candidate_id, job_offer_id)
    ↓
If exists → Return existing_application_id
If not → Return is_duplicate: false
    ↓
Frontend shows message
```

### 2. Éviter les soumissions multiples

- Contrainte UNIQUE en DB: `(candidate_id, job_offer_id)`
- Vérification côté frontend avant submission
- Vérification côté API avant création
- Message d'erreur si doublon détecté

---

## Flux de Limitation de Quota

### 1. Vérifier la limite quotidienne

```
GET /api/profile/quota-status
    ↓
Get today's email quota
    ↓
Count applications sent today
    ↓
Return {
  daily_limit: 10,
  applications_sent_today: 7,
  remaining_quota: 3,
  can_apply: true
}
```

### 2. Empêcher le dépassement

```
User click "Apply" →
  remaining_quota > 0?
    ↓ YES
  Continue to CV generation
    ↓ NO
  Show error message:
  "Limite quotidienne atteinte"
```

---

## Intégration Workflows (n8n)

### 1. CV Generator Workflow

**Déclencheur**: User requests application

```
POST /api/workflows/cv-generate
  {
    candidate_id: "xyz",
    job_offer_id: "abc",
    personalization_level: "advanced"
  }
    ↓
Validate inputs
    ↓
Call n8n webhook:
  POST https://recruit.reveilart4arist.com/webhook/cv-generator
    ↓
n8n Workflow:
  1. Fetch candidate profile
  2. Fetch job offer
  3. Analyze match
  4. Generate personalized CV
  5. Create cover letter
  6. Upload to storage
    ↓
Return URLs to frontend
```

### 2. Job Analyzer Workflow

```
POST /api/workflows/job-analyze
  {
    candidate_id: "xyz",
    job_offer_id: "abc"
  }
    ↓
Call n8n webhook
    ↓
n8n returns:
  {
    match_score: 85,
    strengths: ["Python", "Leadership"],
    weaknesses: ["React"],
    missing_skills: ["TypeScript"],
    recommendations: [...]
  }
```

### 3. Application Sender Workflow

```
POST /api/workflows/send-application
  {
    candidate_id: "xyz",
    job_offer_id: "abc",
    cv_url: "s3://...",
    cover_letter_url: "s3://..."
  }
    ↓
Validate application doesn't exist
    ↓
Check quota
    ↓
Call n8n workflow
    ↓
n8n:
  1. Format email
  2. Send via SMTP
  3. Track email open
  4. Log in database
    ↓
Return confirmation
```

---

## Structure des API Routes

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/verify-email
POST   /api/auth/password-reset
POST   /api/auth/password-reset-confirm
```

### Profile
```
GET    /api/profile
PUT    /api/profile
DELETE /api/profile
GET    /api/profile/applications
GET    /api/profile/quota-status
PUT    /api/profile/password
```

### Applications
```
GET    /api/applications
GET    /api/applications/:id
POST   /api/applications
DELETE /api/applications/:id
POST   /api/applications/request
```

### Workflows
```
POST   /api/workflows/cv-generate
POST   /api/workflows/job-analyze
POST   /api/workflows/send-application
POST   /api/workflows/duplicate-check
GET    /api/workflows/:execution_id/status
```

### Webhooks (from n8n)
```
POST   /api/webhooks/n8n
POST   /api/webhooks/cv-generated
POST   /api/webhooks/job-analyzed
POST   /api/webhooks/application-sent
```

---

## Modèle de Données

### Tables à créer (migrations Prisma)

```prisma
model User {
  id              String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  email           String    @unique
  password_hash   String
  first_name      String
  last_name       String
  phone           String?
  avatar_url      String?
  is_verified     Boolean   @default(false)
  is_active       Boolean   @default(true)
  last_login      DateTime?
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt

  sessions        Session[]
  password_resets PasswordResetToken[]
}

model Session {
  id            String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  user_id       String    @db.Uuid
  access_token  String    @unique
  refresh_token String?   @unique
  expires_at    DateTime
  created_at    DateTime  @default(now())

  user          User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
}

model PasswordResetToken {
  id        String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  user_id   String    @db.Uuid
  token     String    @unique
  expires_at DateTime
  used      Boolean   @default(false)
  created_at DateTime @default(now())

  user      User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
}

model EmailVerificationToken {
  id        String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  user_id   String    @db.Uuid
  email     String
  token     String    @unique
  expires_at DateTime
  used      Boolean   @default(false)
  created_at DateTime @default(now())
}
```

---

## Sécurité

### 1. Hachage des Mots de Passe
- Utiliser `bcrypt` avec salt rounds = 10
- Jamais stocker les mots de passe en clair

### 2. JWT Tokens
- `access_token`: Expire après 15 minutes
- `refresh_token`: Expire après 7 jours
- Stocker tokens dans httpOnly cookies (sécurisé)

### 3. Validation des Entrées
- Valider email format avec regex
- Valider password strength (min 8 chars)
- Sanitizer les inputs pour éviter injection SQL

### 4. Rate Limiting
- Limiter les tentatives de login (5 par minute)
- Limiter les requêtes API (100 par minute)

### 5. CORS
- Permettre uniquement les origins autorisées
- Vérifier referer header

---

## Flow d'Application Complète

```
1. User registers/login
     ↓
2. Frontend stores tokens (httpOnly cookie)
     ↓
3. User fills profile info
     ↓
4. User search job offers
     ↓
5. User clicks "Apply"
     ↓
6. Frontend checks:
     - Token still valid? (refresh if needed)
     - Quota available?
     - Duplicate application?
     ↓
7. If all OK:
     - Generate CV via n8n
     - Analyze job match via n8n
     - Send application via n8n
     ↓
8. Update Application status in DB
     ↓
9. Show confirmation to user
     ↓
10. Workflow n8n tracks:
      - Email opens
      - Replies
      - Interviews
      - Offers
```

---

## Prochaines Étapes

1. Créer les migrations Prisma pour les tables User/Session
2. Implémenter les API routes d'authentification
3. Implémenter les services (auth, profile)
4. Créer les composants React (Login, Register, Dashboard)
5. Configurer les workflows n8n
6. Ajouter les tests unitaires
7. Déployer en production

---

## Ressources

- Types: `types/` directory
- Documentation API: Voir swagger/openapi après implémentation
- Workflows n8n: Voir documentation n8n
