# Configuration du Système d'Authentification avec n8n

Ce guide explique comment configurer le système d'authentification complet avec n8n pour RecruitAI.

## 📋 Prérequis

- n8n installé et accessible (https://reveilart4arist.com)
- PostgreSQL avec la base `job_automation_db`
- Accès SSH au serveur
- Node.js installé (pour bcrypt)

## 🗄️ Étape 1: Appliquer la Migration SQL

### Via SSH sur le serveur:

```bash
# Se connecter à PostgreSQL
ssh root@88.222.221.7

# Exécuter la migration
PGPASSWORD=19CwnDTmqnLyZ49rtVJ7 psql -h localhost -U n8n_user -d job_automation_db -f /home/paul/candidate-profile-system/prisma/migrations/add_authentication_tables.sql

# Vérifier que les tables ont été créées
PGPASSWORD=19CwnDTmqnLyZ49rtVJ7 psql -h localhost -U n8n_user -d job_automation_db -c "\dt" | grep -E "(users|sessions|password_reset_tokens)"
```

## 🔧 Étape 2: Configurer n8n

### 1. Créer les Credentials PostgreSQL

Dans n8n (https://reveilart4arist.com):

1. Aller dans **Settings → Credentials → New**
2. Chercher "Postgres"
3. Nom: `Job Automation DB`
4. Configuration:
   ```
   Host: postgres
   Port: 5432
   Database: job_automation_db
   User: n8n_user
   Password: 19CwnDTmqnLyZ49rtVJ7
   SSL: Disabled
   ```

### 2. Installer le package bcrypt dans n8n

```bash
ssh root@88.222.221.7
docker exec -it n8n sh
npm install bcryptjs
exit
docker restart n8n
```

## 🚀 Étape 3: Créer le Workflow d'Inscription

### Structure du Workflow:

```
┌─────────────┐
│  Webhook    │ POST /api/auth/register
│  (Trigger)  │ Body: {email, password, firstName, lastName}
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Validation  │ Vérifier format email, longueur password
│   (Code)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Check     │ SELECT email FROM users WHERE email = ?
│  Duplicate  │
│  (Postgres) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Hash Pass   │ bcryptjs.hash(password, 10)
│   (Code)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Insert     │ INSERT INTO users (email, password_hash, ...)
│    User     │
│  (Postgres) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Generate   │ JWT avec jsonwebtoken
│    JWT      │
│   (Code)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Insert     │ INSERT INTO sessions (user_id, access_token, ...)
│  Session    │
│  (Postgres) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Response   │ 200: {token, user}
│  (Webhook)  │ 400: {error}
└─────────────┘
```

### Code Nodes pour le Workflow:

#### Node 1: Validation (Code)
```javascript
// Valider les données d'entrée
const { email, password, firstName, lastName } = $json.body;

if (!email || !password || !firstName || !lastName) {
  return {
    error: true,
    message: 'Tous les champs sont requis'
  };
}

// Validation email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return {
    error: true,
    message: 'Email invalide'
  };
}

// Validation password (min 8 caractères)
if (password.length < 8) {
  return {
    error: true,
    message: 'Le mot de passe doit contenir au moins 8 caractères'
  };
}

return {
  email: email.toLowerCase(),
  password,
  firstName,
  lastName
};
```

#### Node 2: Hash Password (Code)
```javascript
const bcrypt = require('bcryptjs');

const password = $json.password;
const passwordHash = await bcrypt.hash(password, 10);

return {
  ...$json,
  passwordHash
};
```

#### Node 3: Generate JWT (Code)
```javascript
const crypto = require('crypto');

// Générer un token unique (simplifié - en production utiliser jsonwebtoken)
const accessToken = crypto.randomBytes(32).toString('hex');
const refreshToken = crypto.randomBytes(32).toString('hex');

// Expiration: 15 minutes pour access_token
const expiresAt = new Date();
expiresAt.setMinutes(expiresAt.getMinutes() + 15);

return {
  ...$json,
  accessToken,
  refreshToken,
  expiresAt: expiresAt.toISOString()
};
```

## 📝 Étape 4: Configuration des Webhooks

### URL du Webhook d'Inscription:
```
https://reveilart4arist.com/webhook/auth-register
```

### Configuration dans les Pages Frontend:

Modifier `app/register/page.tsx` pour pointer vers le webhook n8n:

```typescript
const response = await fetch('https://reveilart4arist.com/webhook/auth-register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
  }),
});
```

## 🧪 Étape 5: Tester le Système

### Test avec curl:

```bash
curl -X POST https://reveilart4arist.com/webhook/auth-register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Jean",
    "lastName": "Dupont"
  }'
```

### Réponse attendue (succès):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "firstName": "Jean",
      "lastName": "Dupont"
    },
    "token": "access-token-here",
    "expiresAt": "2025-10-31T12:00:00Z"
  }
}
```

### Réponse attendue (erreur - email déjà utilisé):
```json
{
  "success": false,
  "error": "Cet email est déjà utilisé"
}
```

## 🔐 Workflows à Créer (Suite)

### 2. Workflow Login (POST /webhook/auth-login)
- Vérifier email/password
- Comparer password_hash avec bcrypt
- Générer nouveau JWT
- Créer session
- Retourner token

### 3. Workflow Logout (POST /webhook/auth-logout)
- Valider token
- Supprimer session
- Retourner succès

### 4. Workflow Verify Token (POST /webhook/auth-verify)
- Vérifier token dans sessions
- Vérifier expiration
- Retourner user_id si valide

### 5. Workflow Forgot Password (POST /webhook/auth-forgot-password)
- Vérifier email existe
- Générer token unique
- Sauvegarder dans password_reset_tokens
- Envoyer email (optionnel pour l'instant)

### 6. Workflow Reset Password (POST /webhook/auth-reset-password)
- Valider token
- Vérifier expiration
- Hash nouveau password
- Update user password_hash
- Marquer token comme used

## 📊 Structure des Tables

### users
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (TEXT)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `is_verified` (BOOLEAN)
- `is_active` (BOOLEAN)
- `created_at` / `updated_at` (TIMESTAMP)

### sessions
- `id` (UUID, PK)
- `user_id` (UUID, FK → users.id)
- `access_token` (TEXT, UNIQUE)
- `refresh_token` (TEXT, UNIQUE)
- `expires_at` (TIMESTAMP)
- `created_at` / `updated_at` (TIMESTAMP)

## 🎯 Prochaines Étapes

1. ✅ **Migration SQL appliquée**
2. ⏳ **Créer workflow Register dans n8n**
3. ⏳ **Créer workflow Login**
4. ⏳ **Créer workflow Logout**
5. ⏳ **Créer workflow Verify Token**
6. ⏳ **Modifier le dashboard pour utiliser les tokens**
7. ⏳ **Ajouter middleware d'authentification**

## 🔗 Ressources

- Templates n8n: https://n8n.io/workflows/
- Documentation JWT: https://jwt.io/
- Bcrypt docs: https://github.com/kelektiv/node.bcrypt.js

## 🐛 Troubleshooting

### Erreur "bcrypt not found"
```bash
docker exec -it n8n sh
npm install bcryptjs
exit
docker restart n8n
```

### Erreur de connexion PostgreSQL
Vérifier que `postgres` est accessible depuis le container n8n:
```bash
docker exec -it n8n sh
ping postgres
```

### Token qui expire trop vite
Modifier l'expiration dans le node "Generate JWT":
```javascript
expiresAt.setHours(expiresAt.getHours() + 24); // 24 heures au lieu de 15 min
```

## 📞 Support

En cas de problème:
1. Vérifier les logs n8n: `docker logs n8n`
2. Vérifier les logs PostgreSQL: `docker logs n8n-postgres`
3. Tester les requêtes SQL directement dans la DB
