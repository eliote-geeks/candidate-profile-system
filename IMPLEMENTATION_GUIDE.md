# Guide d'Implémentation Étape par Étape

## Phase 1: Préparation de la Base de Données

### 1.1 Mettre à jour le schéma Prisma

Édite `prisma/schema.prisma` et ajoute après les modèles existants:

```bash
# 1. Copie les migrations de AUTHENTICATION_PRISMA_MIGRATION.md
# 2. Ajoute-les au fichier schema.prisma

# 3. Exécute la migration
npx prisma migrate dev --name add_authentication_system

# 4. Regénère les types Prisma
npx prisma generate

# 5. Vérifie la DB
npx prisma db push
```

### 1.2 Vérifier les tables créées

```sql
-- Connecte-toi à la DB et vérifie:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Doit inclure:
-- - users
-- - sessions
-- - password_reset_tokens
-- - email_verification_tokens
```

---

## Phase 2: Créer les Services d'Authentification

### 2.1 Créer `lib/services/auth.service.ts`

```typescript
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, AuthSession } from '@/types'

export class AuthService {
  // Hash password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // Generate tokens
  generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    )

    return { accessToken, refreshToken }
  }

  // Register user
  async register(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    const passwordHash = await this.hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
      },
    })

    // TODO: Send verification email

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_verified: user.is_verified,
      is_active: user.is_active,
      created_at: user.created_at!,
      updated_at: user.updated_at!,
    }
  }

  // Login user
  async login(email: string, password: string): Promise<AuthSession> {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) throw new Error('User not found')

    const validPassword = await this.verifyPassword(password, user.password_hash!)
    if (!validPassword) throw new Error('Invalid password')

    const { accessToken, refreshToken } = this.generateTokens(user.id)

    const session = await prisma.session.create({
      data: {
        user_id: user.id,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_verified: user.is_verified,
        is_active: user.is_active,
        created_at: user.created_at!,
        updated_at: user.updated_at!,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: session.expires_at,
      token_type: 'Bearer',
    }
  }

  // Verify token
  async verifyToken(token: string): Promise<{ userId: string }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      return decoded as { userId: string }
    } catch {
      throw new Error('Invalid token')
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!)
      const { userId } = decoded as { userId: string }

      const session = await prisma.session.findUnique({
        where: { refresh_token: refreshToken },
      })

      if (!session) throw new Error('Session not found')

      const newAccessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
      )

      await prisma.session.update({
        where: { id: session.id },
        data: { access_token: newAccessToken },
      })

      return newAccessToken
    } catch {
      throw new Error('Invalid refresh token')
    }
  }
}

export const authService = new AuthService()
```

### 2.2 Créer `lib/services/profile.service.ts`

```typescript
import { prisma } from '@/lib/prisma'
import { CandidateProfile, ApplicationSummary } from '@/types'

export class ProfileService {
  // Get user profile
  async getUserProfile(userId: string): Promise<CandidateProfile | null> {
    const candidate = await prisma.candidate.findFirst({
      where: { email: (await prisma.user.findUnique({ where: { id: userId } }))?.email },
    })

    if (!candidate) return null

    return {
      id: candidate.id,
      email: candidate.email,
      first_name: candidate.first_name,
      last_name: candidate.last_name,
      phone: candidate.phone || undefined,
      location: candidate.location || undefined,
      current_title: candidate.current_title || undefined,
      years_experience: candidate.years_experience || undefined,
      education_level: candidate.education_level || undefined,
      skills: candidate.skills,
      languages: candidate.languages,
      desired_positions: candidate.desired_positions,
      desired_sectors: candidate.desired_sectors,
      desired_locations: candidate.desired_locations,
      min_salary: candidate.min_salary || undefined,
      contract_types: candidate.contract_types,
      base_cv_url: candidate.base_cv_url || undefined,
      linkedin_url: candidate.linkedin_url || undefined,
      portfolio_url: candidate.portfolio_url || undefined,
      active: candidate.active!,
      created_at: candidate.created_at!,
      updated_at: candidate.updated_at!,
    }
  }

  // Get application summary
  async getApplicationSummary(candidateId: string): Promise<ApplicationSummary> {
    const applications = await prisma.application.findMany({
      where: { candidate_id: candidateId },
    })

    return {
      total_sent: applications.length,
      total_opened: applications.filter((a) => a.status === 'opened').length,
      total_replied: applications.filter((a) => a.response_received).length,
      interviews_scheduled: applications.filter((a) => a.interview_scheduled).length,
      offers_received: applications.filter((a) => a.outcome === 'accepted').length,
      acceptance_rate: 0, // TODO: Calculate
      average_response_time_hours: 0, // TODO: Calculate
    }
  }

  // Check duplicate application
  async checkDuplicate(candidateId: string, jobOfferId: string): Promise<boolean> {
    const existing = await prisma.application.findUnique({
      where: {
        candidate_id_job_offer_id: {
          candidate_id: candidateId,
          job_offer_id: jobOfferId,
        },
      },
    })

    return !!existing
  }

  // Check quota
  async checkQuota(candidateId: string): Promise<number> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const count = await prisma.application.count({
      where: {
        candidate_id: candidateId,
        sent_at: {
          gte: today,
        },
      },
    })

    return Math.max(0, 10 - count) // 10 applications per day
  }
}

export const profileService = new ProfileService()
```

---

## Phase 3: Créer les API Routes

### 3.1 Authentification - `app/api/auth/register/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth.service'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const user = await authService.register(email, password, firstName, lastName)

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### 3.2 Authentification - `app/api/auth/login/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth.service'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      )
    }

    const session = await authService.login(email, password)

    // Set httpOnly cookie
    const response = NextResponse.json({ success: true, session })

    response.cookies.set('accessToken', session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    })

    response.cookies.set('refreshToken', session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    )
  }
}
```

---

## Phase 4: Middleware et Protection des Routes

### 4.1 Créer `lib/middleware/auth.middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth.service'

export async function authenticateRequest(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value

  if (!token) {
    return null
  }

  try {
    return await authService.verifyToken(token)
  } catch {
    // Try to refresh
    const refreshToken = request.cookies.get('refreshToken')?.value
    if (refreshToken) {
      try {
        const newToken = await authService.refreshToken(refreshToken)
        return { userId: (await authService.verifyToken(newToken)).userId }
      } catch {
        return null
      }
    }
    return null
  }
}
```

### 4.2 Créer `middleware.ts` à la racine

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/middleware/auth.middleware'

export async function middleware(request: NextRequest) {
  // Protect /api/profile routes
  if (request.nextUrl.pathname.startsWith('/api/profile')) {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/profile/:path*', '/dashboard/:path*'],
}
```

---

## Phase 5: Créer les Pages Frontend

### 5.1 Page Login - `app/login/page.tsx`

### 5.2 Page Register - `app/register/page.tsx`

### 5.3 Page Dashboard - `app/dashboard/page.tsx`

---

## Phase 6: Tester

### 6.1 Test d'inscription

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Jean",
    "lastName": "Dupont"
  }'
```

### 6.2 Test de connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### 6.3 Test d'accès profil protégé

```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer TOKEN_FROM_LOGIN"
```

---

## Variables d'Environnement Requises

Ajoute à `.env.local`:

```env
# JWT Secrets
JWT_SECRET=your_super_secret_key_here_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Email (pour vérification)
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@recruit.com

# n8n Webhooks
N8N_CV_GENERATOR_WEBHOOK=https://recruit.reveilart4arist.com/webhook/cv-generator
N8N_JOB_ANALYZER_WEBHOOK=https://recruit.reveilart4arist.com/webhook/job-analyzer
N8N_APPLICATION_SENDER_WEBHOOK=https://recruit.reveilart4arist.com/webhook/application-sender
```

---

## Dépendances NPM à installer

```bash
npm install bcrypt jsonwebtoken
npm install -D @types/bcrypt @types/jsonwebtoken
```

---

## Checklist de Déploiement

- [ ] Migrations Prisma exécutées
- [ ] Services créés (auth, profile)
- [ ] API routes implémentées
- [ ] Middleware configuré
- [ ] Pages Frontend créées
- [ ] Tests manuels passés
- [ ] Variables d'env configurées
- [ ] CORS configuré
- [ ] Rate limiting implémenté
- [ ] Logging configuré
- [ ] Déploiement en production

---

## Ressources

- Documentation Prisma: https://www.prisma.io/docs/
- JWT: https://jwt.io/
- bcrypt: https://github.com/kelektiv/node.bcrypt.js
- Next.js API Routes: https://nextjs.org/docs/api-routes/introduction
