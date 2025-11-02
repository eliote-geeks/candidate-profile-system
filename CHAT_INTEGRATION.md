# Chat Integration Guide

## Architecture Overview

Le chat onboarding (`ChatOnboarding.tsx`) est maintenant complètement intégré avec:

1. **Frontend:** `components/ChatOnboarding.tsx`
   - Utilise les **17 questions** de `lib/chat-config.ts`
   - Collecte les données avec les **fieldNames snake_case**
   - Envoie à l'API `/api/profiles`

2. **Config:** `lib/chat-config.ts`
   - Define `CHAT_FLOW` avec 17 questions
   - Chaque question mappe à un champ BD:
     - `first_name`, `last_name`, `email`, `phone`, `location`
     - `current_title`, `years_experience`, `education_level`
     - `skills`, `languages`, `desired_positions`, `desired_sectors`, `desired_locations`
     - `min_salary`, `contract_types`, `linkedin_url`, `portfolio_url`

3. **API:** `app/api/profiles/route.ts`
   - POST: Crée un candidat dans `job_automation_db.candidates`
   - Convertit les données du chat en format BD
   - Gère les arrays (skills, languages, contract_types, etc.)
   - Parse les nombres (years_experience, min_salary)

4. **Database:** `prisma/schema.prisma`
   - Model `Candidate` avec tous les champs snake_case
   - Relations avec Application, Document, Email, etc.
   - UUID comme Primary Key

---

## Questions du Chat & Mapping BD

| # | Question | Field BD | Type | Requis |
|---|----------|----------|------|--------|
| 1 | Prénom | `first_name` | text | ✅ |
| 2 | Nom | `last_name` | text | ✅ |
| 3 | Email | `email` | email | ✅ |
| 4 | Téléphone | `phone` | tel | ❌ |
| 5 | Localisation | `location` | text | ❌ |
| 6 | Titre professionnel | `current_title` | text | ❌ |
| 7 | Années d'expérience | `years_experience` | number | ❌ |
| 8 | Niveau d'études | `education_level` | select | ❌ |
| 9 | Compétences | `skills` | array | ❌ |
| 10 | Langues | `languages` | array | ❌ |
| 11 | Postes désirés | `desired_positions` | array | ❌ |
| 12 | Secteurs désirés | `desired_sectors` | array | ❌ |
| 13 | Localisations désirées | `desired_locations` | array | ❌ |
| 14 | Salaire minimum | `min_salary` | number | ❌ |
| 15 | Types de contrats | `contract_types` | multiselect | ❌ |
| 16 | LinkedIn | `linkedin_url` | text | ❌ |
| 17 | Portfolio | `portfolio_url` | text | ❌ |

---

## Data Flow

```
ChatOnboarding (Frontend)
    ↓
    [Collecte 17 questions avec fieldNames snake_case]
    ↓
formData: {
  first_name: "Paul",
  last_name: "Kamgang",
  email: "paul@example.com",
  phone: "+237612345678",
  location: "Douala",
  current_title: "Senior Dev",
  years_experience: 5,
  education_level: "Bac+5",
  skills: "Python, JavaScript, React",
  languages: "Français, Anglais",
  desired_positions: "Tech Lead, Full Stack",
  desired_sectors: "FinTech, SaaS",
  desired_locations: "Douala, Remote",
  min_salary: 500000,
  contract_types: ["CDI", "Consulting"],
  linkedin_url: "https://linkedin.com/in/paul",
  portfolio_url: "https://paul.dev"
}
    ↓
POST /api/profiles
    ↓
API Route (Backend)
    [Validation & Conversion]
    - Parse numbers: years_experience, min_salary
    - Split strings to arrays: skills, languages, desired_*
    - Ensure contract_types is array
    ↓
prisma.candidate.create({
  first_name: "Paul",
  last_name: "Kamgang",
  email: "paul@example.com",
  phone: "+237612345678",
  location: "Douala",
  current_title: "Senior Dev",
  years_experience: 5,
  education_level: "Bac+5",
  skills: ["Python", "JavaScript", "React"],
  languages: ["Français", "Anglais"],
  desired_positions: ["Tech Lead", "Full Stack"],
  desired_sectors: ["FinTech", "SaaS"],
  desired_locations: ["Douala", "Remote"],
  min_salary: 500000,
  contract_types: ["CDI", "Consulting"],
  linkedin_url: "https://linkedin.com/in/paul",
  portfolio_url: "https://paul.dev",
  active: true
})
    ↓
job_automation_db.candidates
    [Données sauvegardées! ✅]
```

---

## Testing

### Setup

1. **Terminal 1 - SSH Tunnel**
```bash
./scripts/ssh-tunnel.sh
```

2. **Terminal 2 - Dev Server**
```bash
npm run dev
```

3. **Browser**
```
http://localhost:3000/onboarding
```

### Manual API Test

```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "phone": "+237612345678",
    "location": "Douala",
    "current_title": "Developer",
    "years_experience": "3",
    "education_level": "Bac+3",
    "skills": "Python, JavaScript",
    "languages": "Français, Anglais",
    "desired_positions": "Full Stack",
    "desired_sectors": "Tech",
    "desired_locations": "Douala",
    "min_salary": "400000",
    "contract_types": ["CDI"],
    "linkedin_url": "https://linkedin.com/in/test",
    "portfolio_url": "https://test.dev"
  }'
```

### Verify in Database

```bash
# Connect to VPS
ssh root@88.222.221.7

# Check if candidate was created
docker exec n8n-postgres bash -c "PGPASSWORD='__n8n_BLANK_VALUE_e5362baf-c777-4d57-a609-6eaf1f9e87f6' psql -U n8n_user -d job_automation_db -c \"SELECT * FROM candidates ORDER BY created_at DESC LIMIT 1;\""
```

---

## Form Data Conversion Rules

### Strings → Arrays

Ces champs acceptent des virgules dans le chat et sont convertis en arrays par l'API:
- `skills`: "Python, JavaScript, React" → ["Python", "JavaScript", "React"]
- `languages`: "Français, Anglais" → ["Français", "Anglais"]
- `desired_positions`: "Tech Lead, Full Stack" → ["Tech Lead", "Full Stack"]
- `desired_sectors`: "FinTech, SaaS" → ["FinTech", "SaaS"]
- `desired_locations`: "Douala, Remote" → ["Douala", "Remote"]

### Multiselect → Array

- `contract_types`: Les sélections du multiselect restent directement un array

### Strings → Numbers

- `years_experience`: "5" → 5
- `min_salary`: "500000" → 500000

---

## Notes Importantes

1. **snake_case everywhere**: Les fieldNames utilisent snake_case pour matcher exactement la BD
2. **Validation**: Email et phone ont des regex de validation
3. **Optionnel**: Seuls `first_name` et `email` sont requis
4. **Arrays**: Les arrays sont **virgule-séparées** dans l'input text ou multiselect pour les options prédéfinies
5. **Database**: Les données vont directement dans `job_automation_db.candidates` via le tunnel SSH

---

## Next Steps

- [ ] Tester le chat complet de bout en bout
- [ ] Vérifier les données dans la BD VPS
- [ ] Configurer le dashboard pour afficher les candidats
- [ ] Intégrer avec les workflows n8n
- [ ] GitHub + Vercel deployment
