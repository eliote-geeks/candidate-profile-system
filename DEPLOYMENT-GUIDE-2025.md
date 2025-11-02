# 🚀 Guide de Déploiement 2025 - RecruitAI

**Dernière mise à jour:** 2025-10-30
**Stack:** Next.js 16 + Prisma 6 + PostgreSQL (VPS)
**Déploiement:** Vercel

---

## ✅ Configuration Actuelle (Développement)

### Architecture

```
┌──────────────────────────────────┐
│  Local: Next.js Dev Server       │
│  http://localhost:3000           │
│  • /onboarding (Chat formulaire) │
│  • /dashboard (Suivi)            │
│  • POST /api/profiles            │
└─────────────┬────────────────────┘
              │ SSH Tunnel
              │ localhost:5432
              ↓
┌──────────────────────────────────┐
│  VPS: 88.222.221.7               │
│  PostgreSQL (Docker)             │
│  job_automation_db               │
│  • 11 tables                     │
│  • 90 jobs scrapés               │
└──────────────────────────────────┘
```

### ✅ Déjà Configuré

- [x] SSH Tunnel pour connexion DB locale
- [x] Prisma Schema introspect depuis VPS
- [x] Prisma Client généré
- [x] API `/api/profiles` fonctionnelle
- [x] Chat Onboarding avec 17 questions
- [x] Transformation texte → PostgreSQL arrays
- [x] Connection pooling configuré

---

## 🧪 TESTER EN LOCAL

### 1. Démarrer le tunnel SSH

```bash
cd /home/paul/Bureau/candidate-profile-system
./scripts/ssh-tunnel.sh
```

Laissez ce terminal ouvert.

### 2. Démarrer le serveur Next.js

```bash
# Dans un nouveau terminal
cd /home/paul/Bureau/candidate-profile-system
npm run dev
```

### 3. Tester le formulaire

Ouvrez: **http://localhost:3000/onboarding**

Remplissez le formulaire (17 questions). À la fin, le profil sera enregistré dans la base PostgreSQL sur le VPS.

### 4. Vérifier l'enregistrement

```bash
ssh root@88.222.221.7
docker exec -i n8n-postgres psql -U n8n_user -d job_automation_db -c "SELECT first_name, last_name, email, created_at FROM candidates ORDER BY created_at DESC LIMIT 5;"
```

---

## 📦 DÉPLOIEMENT SUR VERCEL

### Étape 1: Préparer le Repository GitHub

```bash
cd /home/paul/Bureau/candidate-profile-system

# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "feat: Candidate profile system with Prisma + VPS PostgreSQL"

# Ajouter le remote GitHub
git remote add origin https://github.com/eliote-geeks/candidate-profile-system.git
git branch -M main
git push -u origin main
```

### Étape 2: Configurer Vercel

1. **Connecter à Vercel**
   - Aller sur https://vercel.com/new
   - Import depuis GitHub: `eliote-geeks/candidate-profile-system`

2. **Variables d'environnement Vercel**

Ajouter dans **Settings → Environment Variables** :

```env
# PostgreSQL (Connexion directe VPS - PROBLÈME!)
DATABASE_URL=postgresql://n8n_user:19CwnDTmqnLyZ49rtVJ7@88.222.221.7:5432/job_automation_db?schema=public&connection_limit=1&pool_timeout=10

# Application
NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app

# n8n (optionnel)
N8N_BASE_URL=https://reveilart4arist.com
```

### ⚠️ PROBLÈME: PostgreSQL n'est pas accessible depuis Vercel

Le PostgreSQL sur votre VPS est dans un conteneur Docker et **n'est pas exposé à internet**. Vercel ne peut pas s'y connecter directement.

---

## 🔧 SOLUTIONS POUR VERCEL

### Option 1: Exposer PostgreSQL sur le VPS (Recommandé pour dev)

**Sur le VPS:**

```bash
ssh root@88.222.221.7

# 1. Modifier docker-compose.yml de n8n pour exposer PostgreSQL
cd /home/paul/n8n-installation
nano docker-compose.yml

# Ajouter dans la section postgres:
ports:
  - "5432:5432"

# 2. Redémarrer le conteneur
docker compose restart

# 3. Configurer le firewall
ufw allow 5432/tcp

# 4. Tester la connexion depuis votre PC
psql "postgresql://n8n_user:19CwnDTmqnLyZ49rtVJ7@88.222.221.7:5432/job_automation_db"
```

**Vercel `.env` :**

```env
DATABASE_URL="postgresql://n8n_user:19CwnDTmqnLyZ49rtVJ7@88.222.221.7:5432/job_automation_db?schema=public&sslmode=disable&connection_limit=1"
```

**⚠️ Attention Sécurité:**
- Activez SSL sur PostgreSQL (recommandé)
- Restreignez les IPs autorisées (Vercel IPs)
- Changez le mot de passe

---

### Option 2: Utiliser Vercel Postgres (Plus Simple)

**Avantages:**
- Zéro configuration
- SSL automatique
- Connection pooling intégré
- Pas de problèmes de connexion

**Inconvénient:**
- Base de données séparée (pas la même que n8n)
- Besoin de synchroniser les données

**Créer Vercel Postgres:**

```bash
# Via Vercel Dashboard
# Storage → Create Database → Postgres
# Copier le DATABASE_URL généré
```

**Migration:**

```bash
# Dump depuis VPS
ssh root@88.222.221.7 "docker exec n8n-postgres pg_dump -U n8n_user job_automation_db" > backup.sql

# Restore vers Vercel Postgres
psql "VERCEL_DATABASE_URL" < backup.sql
```

---

### Option 3: PgBouncer + Proxy (Production Ready)

Installer PgBouncer sur le VPS pour gérer les connexions:

```bash
# Sur le VPS
apt install pgbouncer
nano /etc/pgbouncer/pgbouncer.ini

# Configurer pour écouter sur 0.0.0.0:6432
# Pool les connexions vers PostgreSQL
```

---

## 🌐 BONNES PRATIQUES 2025

### 1. Connection Pooling

**Local (.env.local):**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db?connection_limit=5"
```

**Vercel:**
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=1&pool_timeout=10"
```

### 2. Prisma Configuration

**prisma/schema.prisma:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  // Pour Vercel, utiliser binary natif
  // binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

**package.json:**
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### 3. Singleton Prisma Client

**lib/prisma.ts:**
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 4. Server Actions (Alternative aux API Routes)

**Pour Next.js 15+, vous pouvez utiliser Server Actions:**

```typescript
'use server'

import { prisma } from '@/lib/prisma'

export async function createProfile(formData: FormData) {
  const data = {
    first_name: formData.get('first_name') as string,
    email: formData.get('email') as string,
    // ...
  }

  const candidate = await prisma.candidate.create({ data })
  return { success: true, id: candidate.id }
}
```

Mais pour votre cas (fetch depuis client), l'API Route est correcte.

---

## 🔐 SÉCURITÉ

### Variables sensibles

**Ne jamais commit:**
- `.env.local`
- `.env.production`
- Mots de passe en clair

**Utiliser:**
- Vercel Environment Variables
- Secrets Manager (pour production)

### PostgreSQL

```bash
# Changer le mot de passe
ssh root@88.222.221.7
docker exec -it n8n-postgres psql -U postgres
ALTER USER n8n_user WITH PASSWORD 'NOUVEAU_MOT_DE_PASSE_FORT';
```

---

## 📊 MONITORING

### Logs Vercel

```bash
vercel logs
```

### Logs PostgreSQL

```bash
docker logs n8n-postgres --tail 100 --follow
```

### Prisma Studio (GUI)

```bash
npx prisma studio
# Ouvre http://localhost:5555
```

---

## 🐛 TROUBLESHOOTING

### Erreur: Connection refused

**Cause:** SSH tunnel pas démarré ou PostgreSQL pas exposé

**Solution:**
```bash
./scripts/ssh-tunnel.sh
# OU exposer PostgreSQL (voir Option 1)
```

### Erreur: P2024 (Connection pool exhausted)

**Cause:** Trop de connexions simultanées

**Solution:**
```env
DATABASE_URL="...?connection_limit=1&pool_timeout=20"
```

### Erreur: SSL required

**Cause:** PostgreSQL exige SSL

**Solution:**
```env
DATABASE_URL="...?sslmode=require"
```

---

## 📚 RESSOURCES

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Vercel Deployment](https://vercel.com/docs/concepts/deployments)
- [PostgreSQL Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

## ✅ CHECKLIST DÉPLOIEMENT

**Avant de push sur GitHub:**
- [ ] `.env.local` dans `.gitignore`
- [ ] `postinstall` script dans `package.json`
- [ ] Tester en local que tout fonctionne
- [ ] Documenter les variables d'environnement

**Sur Vercel:**
- [ ] Ajouter toutes les variables d'environnement
- [ ] Tester la connexion DB (voir Option 1 ou 2)
- [ ] Vérifier les logs après premier déploiement
- [ ] Tester le formulaire en production

**Post-déploiement:**
- [ ] Configurer un domaine personnalisé
- [ ] Configurer SSL (automatique sur Vercel)
- [ ] Monitorer les erreurs
- [ ] Backups réguliers de la DB

---

**🎉 Votre application est maintenant prête pour GitHub + Vercel !**

Pour toute question: [GitHub Issues](https://github.com/eliote-geeks/candidate-profile-system/issues)
