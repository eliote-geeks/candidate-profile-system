# 🔐 Guide Complet des Workflows d'Authentification

## 📊 État Actuel

| Workflow | Statut | Path Webhook | File |
|----------|--------|--------------|------|
| Auth - Register | ✅ ACTIF | `/webhook/auth-register` | `auth-register-workflow-final.json` |
| Auth - Login | ❌ **MANQUANT** | `/webhook/auth-login` | `auth-login-workflow-pgcrypto.json` |
| Auth - Logout | ✅ ACTIF | `/webhook/auth-logout` | `auth-logout-workflow.json` |
| Verify Token | ⏳ À CRÉER | `/webhook/verify-token` | À créer |
| Refresh Token | ⏳ À CRÉER | `/webhook/refresh-token` | À créer |

---

## 🚀 Architecture Complète d'Authentification

```
FRONTEND (React)
    ↓
┌─────────────────────────────────────┐
│  Next.js API Routes (/api/auth/*)   │
│  - Proxy vers les webhooks          │
│  - Gestion des erreurs              │
│  - Validation des données           │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  n8n Workflows (Webhooks)           │
│  - Logique métier                   │
│  - Appels PostgreSQL                │
│  - Génération de tokens             │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  PostgreSQL (job_automation_db)     │
│  - Tables: users, sessions          │
│  - pgcrypto pour hasher les mots de passe  │
└─────────────────────────────────────┘
```

---

## 📥 Étape 1: Importer le Workflow Auth - Login

### Option A: Via n8n UI (Manuel)

1. **Ouvre n8n:** https://n8n.obuy.cloud
2. **Clique sur "Add Workflow"** → "Import from file"
3. **Sélectionne le fichier:**
   ```
   /home/paul/Bureau/candidate-profile-system/n8n-workflows/auth-login-workflow-pgcrypto.json
   ```
4. **Configure les credentials PostgreSQL:**
   - Pour chaque node PostgreSQL (Check Credentials, Insert Session)
   - Credentials: `Job Automation DB`
   - Si pas existant, crée avec:
     ```
     Host: postgres
     Port: 5432
     Database: job_automation_db
     User: n8n_user
     Password: 19CwnDTmqnLyZ49rtVJ7
     SSL: Disabled
     ```

5. **Sauvegarde et active** (toggle vert en haut à droite)

### Option B: Via SSH + API (Automatisé)

À venir: Script d'import automatique

---

## 🔄 Workflow Auth - Login (Structure)

```
┌──────────────────┐
│  Webhook Login   │  POST /auth-login
│  {email, pass}   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Validation     │  Valider email + password
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Check Creds     │  SELECT user + verify password (pgcrypto)
│  (PostgreSQL)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Verify Creds    │  Vérifier password_match
│    (Code)        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Gen Tokens       │  Générer access + refresh tokens
│    (Code)        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Insert Session   │  INSERT INTO sessions (PostgreSQL)
│  (PostgreSQL)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Respond Success  │  { success, user, token, ... }
└──────────────────┘
```

---

## 🧪 Tests

### Test 1: Register
```bash
curl -X POST https://recruit.reveilart4arist.com/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com",
    "password": "SecurePassword123"
  }'
```

**Réponse attendue:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "jean.dupont@example.com",
      "firstName": "Jean",
      "lastName": "Dupont",
      "isVerified": false,
      "isActive": true
    },
    "token": "...",
    "refreshToken": "...",
    "expiresAt": "2025-10-31T16:31:29.126Z"
  }
}
```

### Test 2: Login (À FAIRE APRÈS IMPORT)
```bash
curl -X POST https://recruit.reveilart4arist.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "SecurePassword123"
  }'
```

---

## 📋 Checklist

- [ ] Importer workflow "Auth - Login"
- [ ] Configurer PostgreSQL credentials
- [ ] Activer le workflow
- [ ] Tester le webhook via curl
- [ ] Tester l'API route `/api/auth/login`
- [ ] Tester login via le formulaire
- [ ] Créer workflow "Verify Token"
- [ ] Créer workflow "Refresh Token"
- [ ] Tester tous les flows end-to-end
- [ ] Documenter les erreurs potentielles

---

## 🔗 Fichiers Concernés

### Workflows n8n (à importer)
- `n8n-workflows/auth-login-workflow-pgcrypto.json`
- `n8n-workflows/auth-logout-workflow.json` (déjà actif)
- `n8n-workflows/auth-register-workflow-final.json` (déjà actif)

### API Routes Next.js (créées)
- `app/api/auth/register/route.ts` ✅
- `app/api/auth/login/route.ts` ✅
- `app/api/auth/logout/route.ts` (À créer)
- `app/api/auth/verify-token/route.ts` (À créer)
- `app/api/auth/refresh-token/route.ts` (À créer)

### Pages Frontend
- `app/register/page.tsx` ✅ (utilise `/api/auth/register`)
- `app/login/page.tsx` ✅ (utilise `/api/auth/login`)
- `app/dashboard/page.tsx` ✅ (a logout button)

---

## 🎯 Prochaines Étapes

1. ✅ Importer Auth - Login workflow
2. ⏳ Créer API route `/api/auth/logout`
3. ⏳ Créer API route `/api/auth/verify-token`
4. ⏳ Créer API route `/api/auth/refresh-token`
5. ⏳ Ajouter middleware pour protéger les routes
6. ⏳ Tester tout end-to-end
7. ⏳ Documenter les erreurs et solutions

---

## 🚨 Troubleshooting

### Webhook retourne 404
→ Le workflow n'est pas actif ou n'existe pas
→ Vérifier dans n8n: Settings → Workflows → Chercher le workflow
→ Vérifier que le toggle est vert (ACTIF)

### Erreur PostgreSQL "Credential not found"
→ Double-cliquer sur le node PostgreSQL
→ Sélectionner "Job Automation DB" dans la liste
→ Si absent, créer le credential

### Erreur "password_hash = crypt()" failed
→ L'extension pgcrypto n'est pas activée
→ Exécuter sur le serveur:
```bash
docker exec n8n-postgres psql -U n8n_user -d job_automation_db -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
```

---

**Version:** 1.0
**Date:** 2025-10-31
**Status:** 🔴 À COMPLÉTER - Auth - Login manquant
