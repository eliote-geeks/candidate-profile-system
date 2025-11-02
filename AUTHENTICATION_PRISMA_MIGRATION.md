# Migration Prisma pour le Système d'Authentification

## Vue d'ensemble

Ce document décrit les migrations Prisma nécessaires pour ajouter le système d'authentification au schéma existant.

---

## Migration 1: Ajouter la table User

```prisma
model User {
  id              String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  email           String    @unique @db.VarChar(255)
  password_hash   String    @db.Text
  first_name      String    @db.VarChar(100)
  last_name       String    @db.VarChar(100)
  phone           String?   @db.VarChar(20)
  avatar_url      String?
  is_verified     Boolean   @default(false)
  is_active       Boolean   @default(true)
  last_login      DateTime?
  created_at      DateTime  @default(now()) @db.Timestamp(6)
  updated_at      DateTime  @updatedAt @db.Timestamp(6)

  sessions              Session[]
  password_reset_tokens PasswordResetToken[]
  email_verification    EmailVerificationToken[]

  @@index([email], map: "idx_users_email")
  @@index([is_active], map: "idx_users_active")
  @@map("users")
}
```

---

## Migration 2: Ajouter la table Session

```prisma
model Session {
  id            String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  user_id       String    @db.Uuid
  access_token  String    @unique @db.Text
  refresh_token String?   @unique @db.Text
  expires_at    DateTime  @db.Timestamp(6)
  created_at    DateTime  @default(now()) @db.Timestamp(6)

  user          User      @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id], map: "idx_sessions_user")
  @@index([expires_at], map: "idx_sessions_expires")
  @@map("sessions")
}
```

---

## Migration 3: Ajouter la table PasswordResetToken

```prisma
model PasswordResetToken {
  id        String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  user_id   String    @db.Uuid
  token     String    @unique @db.Text
  expires_at DateTime  @db.Timestamp(6)
  used      Boolean   @default(false)
  created_at DateTime  @default(now()) @db.Timestamp(6)

  user      User      @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@index([user_id], map: "idx_password_resets_user")
  @@index([token], map: "idx_password_resets_token")
  @@map("password_reset_tokens")
}
```

---

## Migration 4: Ajouter la table EmailVerificationToken

```prisma
model EmailVerificationToken {
  id        String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  user_id   String    @db.Uuid
  email     String    @db.VarChar(255)
  token     String    @unique @db.Text
  expires_at DateTime  @db.Timestamp(6)
  used      Boolean   @default(false)
  created_at DateTime  @default(now()) @db.Timestamp(6)

  @@index([user_id], map: "idx_email_verification_user")
  @@index([token], map: "idx_email_verification_token")
  @@map("email_verification_tokens")
}
```

---

## Migration 5: Lier Candidate à User (optionnel)

Si tu veux lier les candidats existants aux utilisateurs:

```prisma
model Candidate {
  id                String        @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  user_id           String?       @db.Uuid  // NEW: optionnel au début
  first_name        String        @db.VarChar(100)
  last_name         String        @db.VarChar(100)
  email             String        @unique @db.VarChar(255)
  phone             String?       @db.VarChar(20)
  location          String?       @db.VarChar(255)
  current_title     String?       @db.VarChar(255)
  years_experience  Int?
  education_level   String?       @db.VarChar(100)
  skills            String[]
  languages         String[]
  desired_positions String[]
  desired_sectors   String[]
  desired_locations String[]
  min_salary        Int?
  contract_types    String[]
  base_cv_url       String?
  linkedin_url      String?
  portfolio_url     String?
  active            Boolean?      @default(true)
  created_at        DateTime?     @default(now()) @db.Timestamp(6)
  updated_at        DateTime?     @default(now()) @updatedAt @db.Timestamp(6)

  // NEW: Relations
  user              User?         @relation(fields: [user_id], references: [id], onDelete: SetNull)

  ab_tests          ABTest[]
  analytics         Analytic[]
  applications      Application[]
  documents         Document[]
  system_logs       SystemLog[]

  @@index([active], map: "idx_candidates_active")
  @@index([email], map: "idx_candidates_email")
  @@index([user_id], map: "idx_candidates_user")  // NEW
  @@map("candidates")
}
```

---

## Étapes pour appliquer les migrations

### 1. Mettre à jour le schéma Prisma

Ajouter le contenu ci-dessus au fichier `prisma/schema.prisma`

### 2. Créer la migration

```bash
npx prisma migrate dev --name add_authentication_system
```

Cela va:
- Créer un fichier de migration dans `prisma/migrations/`
- Appliquer la migration à la base de données
- Regénérer le client Prisma

### 3. Vérifier la migration

```bash
npx prisma db push
npx prisma db seed  # Si tu as un seed file
```

### 4. Tester la migration en développement

```bash
npm run dev
```

---

## Structure SQL générée

Après les migrations, tu auras ces tables:

```sql
-- Table users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Table sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT UNIQUE NOT NULL,
  refresh_token TEXT UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Table password_reset_tokens
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Table email_verification_tokens
CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_password_resets_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_resets_token ON password_reset_tokens(token);
CREATE INDEX idx_email_verification_user ON email_verification_tokens(user_id);
CREATE INDEX idx_email_verification_token ON email_verification_tokens(token);
```

---

## Ajouter des contraintes de sécurité

### Politique Row Level Security (RLS) - PostgreSQL

```sql
-- Permettre aux utilisateurs de voir uniquement leurs propres données
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own sessions"
  ON sessions
  FOR SELECT
  USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can only delete their own sessions"
  ON sessions
  FOR DELETE
  USING (auth.uid()::uuid = user_id);
```

---

## Gestion des Données Existantes

### Migrer les Candidates existants vers Users

```sql
-- Créer des Users à partir des Candidates
INSERT INTO users (
  email,
  password_hash,
  first_name,
  last_name,
  phone,
  is_verified,
  is_active
)
SELECT
  email,
  '--migrate--' as password_hash,  -- Forcer reset password
  first_name,
  last_name,
  phone,
  true as is_verified,
  active as is_active
FROM candidates
ON CONFLICT (email) DO NOTHING;

-- Lier les Candidates aux Users
UPDATE candidates c
SET user_id = u.id
FROM users u
WHERE c.email = u.email;
```

---

## Alternatives d'Architecture

### Option 1: Candidate + User (Recommandé)
- Candidate contient les infos du profil professionnel
- User contient les infos d'authentification
- Relation 1-to-1 via user_id

### Option 2: User seul
- Fusionner Candidate et User en une seule table
- Plus simple mais moins flexible
- Champs redondants possibles

### Option 3: Cascade (Alternative)
- User = authentification
- Candidate = réseau social/profil public
- Différentes permissions pour chaque

---

## Rollback en cas de problème

```bash
# Annuler la dernière migration
npx prisma migrate resolve --rolled-back <migration_name>

# Ou recommencer depuis une migration spécifique
npx prisma migrate deploy

# Voir l'historique des migrations
npx prisma migrate status
```

---

## Vérifier les migrations appliquées

```bash
# Voir toutes les migrations
npx prisma migrate status

# Inspect a migration
cat prisma/migrations/<timestamp>_<name>/migration.sql
```

---

## Prochaines étapes

1. Exécuter: `npx prisma migrate dev --name add_authentication_system`
2. Implémenter les services d'authentification
3. Créer les API routes
4. Ajouter les tests
5. Configurer les env variables
