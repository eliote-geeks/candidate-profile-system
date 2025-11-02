# 🔐 Guide des Workflows d'Authentification avec pgcrypto

## ✅ Problème Résolu

Le problème **bcryptjs module not found** a été résolu en utilisant l'extension **pgcrypto** de PostgreSQL directement dans les requêtes SQL, ce qui évite complètement la dépendance npm dans n8n.

## 🎯 Ce qui a été fait

### 1. Extension pgcrypto activée ✅
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```
L'extension est maintenant active dans `job_automation_db`.

### 2. Workflows mis à jour ✅

Trois nouveaux fichiers ont été créés dans `n8n-workflows/`:

1. **auth-register-workflow-pgcrypto.json** - Inscription avec pgcrypto
2. **auth-login-workflow-pgcrypto.json** - Connexion avec pgcrypto
3. **auth-logout-workflow.json** - Déconnexion (inchangé)

## 📥 Comment importer les workflows dans n8n

### Étape 1: Se connecter à n8n
```
URL: https://reveilart4arist.com
User: admin
Password: dXpTpvhaOLSS
```

### Étape 2: Supprimer l'ancien workflow Register (si existant)
1. Aller dans "Workflows"
2. Trouver "Auth - Register" (celui avec bcryptjs)
3. Cliquer sur "..." → "Delete"

### Étape 3: Importer le nouveau workflow Register
1. Cliquer sur "Add workflow" → "Import from file"
2. Sélectionner `n8n-workflows/auth-register-workflow-pgcrypto.json`
3. Le workflow s'ouvre automatiquement

### Étape 4: Configurer les credentials PostgreSQL
Pour **chaque node PostgreSQL** dans le workflow:
1. Cliquer sur le node (Check Email Exists, Insert User with pgcrypto, Insert Session)
2. Dans "Credential to connect with", sélectionner "Job Automation DB"
3. Si le credential n'existe pas:
   - Cliquer sur "Create New Credential"
   - Nom: `Job Automation DB`
   - Host: `postgres`
   - Port: `5432`
   - Database: `job_automation_db`
   - User: `n8n_user`
   - Password: `19CwnDTmqnLyZ49rtVJ7`
   - SSL: `Disabled`
   - Cliquer sur "Save"

### Étape 5: Sauvegarder et activer
1. Cliquer sur "Save" en haut à droite
2. Activer le workflow avec le toggle en haut à droite (doit être vert)

### Étape 6: Répéter pour Login
1. Importer `n8n-workflows/auth-login-workflow-pgcrypto.json`
2. Configurer les credentials PostgreSQL pour tous les nodes
3. Sauvegarder et activer

### Étape 7: Vérifier Logout (optionnel)
1. Si le workflow Logout existe déjà et fonctionne, ne rien faire
2. Sinon, importer `n8n-workflows/auth-logout-workflow.json`
3. Configurer les credentials et activer

## 🔬 Comment fonctionne pgcrypto

### Hashing du mot de passe (Register)
```sql
INSERT INTO users (email, password_hash, ...)
VALUES (
  'user@example.com',
  crypt('password123', gen_salt('bf')),  -- Hash avec Blowfish (bcrypt algorithm)
  ...
)
```

### Vérification du mot de passe (Login)
```sql
SELECT
  *,
  (password_hash = crypt('user_input_password', password_hash)) AS password_match
FROM users
WHERE email = 'user@example.com'
```

Si `password_match` = `true`, le mot de passe est correct.

## 🧪 Test des workflows

### Test 1: Inscription (Register)
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

**Résultat attendu:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid...",
      "email": "test@example.com",
      "firstName": "Jean",
      "lastName": "Dupont",
      "isVerified": false,
      "isActive": true
    },
    "token": "abc123...",
    "refreshToken": "def456...",
    "expiresAt": "2025-10-31T12:15:00.000Z"
  }
}
```

### Test 2: Connexion (Login)
```bash
curl -X POST https://reveilart4arist.com/webhook/auth-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Résultat attendu:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid...",
      "email": "test@example.com",
      "firstName": "Jean",
      "lastName": "Dupont"
    },
    "token": "ghi789...",
    "refreshToken": "jkl012...",
    "expiresAt": "2025-10-31T12:15:00.000Z"
  }
}
```

### Test 3: Déconnexion (Logout)
```bash
curl -X POST https://reveilart4arist.com/webhook/auth-logout \
  -H "Authorization: Bearer ghi789..."
```

**Résultat attendu:**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

## 🚨 Troubleshooting

### Erreur: "pgcrypto extension not found"
```bash
# Réactiver l'extension
ssh root@88.222.221.7 "docker exec n8n-postgres psql -U n8n_user -d job_automation_db -c 'CREATE EXTENSION IF NOT EXISTS pgcrypto;'"
```

### Erreur: "Credential not found"
- Vérifier que "Job Automation DB" est bien configuré dans Settings → Credentials
- Vérifier que chaque node PostgreSQL utilise bien ce credential

### Erreur: "Webhook not found" (404)
- Vérifier que le workflow est bien **activé** (toggle vert en haut à droite)
- Vérifier que le path du webhook est correct: `auth-register`, `auth-login`, `auth-logout`

### Le workflow ne s'exécute pas
1. Ouvrir le workflow dans n8n
2. Cliquer sur "Execute Workflow" pour tester manuellement
3. Regarder les logs de chaque node pour voir où ça bloque
4. Vérifier que les connexions entre nodes sont correctes

### Mot de passe toujours incorrect au login
- Vérifier que le user a bien été créé avec le workflow Register (pas manuellement)
- Vérifier que pgcrypto est bien activé
- Tester en créant un nouveau compte

## 📊 Architecture Finale

```
Frontend (Next.js)
     │
     │ HTTPS POST /webhook/auth-register
     ▼
┌─────────────────────────────────────┐
│  n8n Workflow: Auth - Register      │
│                                     │
│  1. Webhook POST                    │
│  2. Validation (Code node)          │
│  3. Check Email (Postgres)          │
│  4. Insert User (Postgres + pgcrypto) ◄── crypt('password', gen_salt('bf'))
│  5. Generate Tokens (Code node)     │
│  6. Insert Session (Postgres)       │
│  7. Respond Success                 │
└─────────────────────────────────────┘
     │
     ▼
PostgreSQL (job_automation_db)
- users table (avec password_hash hashé par pgcrypto)
- sessions table
```

## ✅ Checklist de déploiement

- [x] Extension pgcrypto activée
- [ ] Workflow Register importé et activé
- [ ] Workflow Login importé et activé
- [ ] Workflow Logout importé et activé
- [ ] Credentials PostgreSQL configurés
- [ ] Test Register réussi (curl)
- [ ] Test Login réussi (curl)
- [ ] Test Logout réussi (curl)
- [ ] Test depuis le frontend /register
- [ ] Test depuis le frontend /login
- [ ] Test déconnexion depuis dashboard

## 🎓 Avantages de pgcrypto vs bcryptjs

✅ **Avantages:**
1. Pas besoin d'installer de dépendances npm dans n8n
2. Hashing directement dans PostgreSQL (plus performant)
3. Utilise le même algorithme bcrypt (compatible)
4. Pas de problème de sandbox VM2
5. Plus sécurisé (les mots de passe ne transitent jamais hors de la DB)

⚠️ **Inconvénients:**
1. Nécessite l'extension pgcrypto dans PostgreSQL
2. Légèrement moins flexible que le code JavaScript

## 📝 Prochaines étapes

Après avoir testé l'authentification:

1. **Créer workflow Verify Token** - Pour protéger les routes
2. **Créer workflow Refresh Token** - Pour prolonger les sessions
3. **Implémenter forgot-password** - Workflow de réinitialisation
4. **Implémenter email verification** - Workflow de vérification d'email
5. **Ajouter rate limiting** - Protection contre les abus
6. **Ajouter logging** - Tracer les tentatives de connexion

---

**Créé le:** 2025-10-31
**Version:** 2.0 (avec pgcrypto)
**Status:** ✅ Prêt pour le déploiement
