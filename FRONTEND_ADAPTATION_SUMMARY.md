# Frontend Adaptation Summary

## ✅ Chat Frontend Adaptée aux Champs BD

Le chat onboarding a été complètement adapté pour matcher les 17 champs de la BD `job_automation_db.candidates` en **snake_case**.

---

## Changements Effectués

### 1. **Type Definition** (ChatOnboarding.tsx)

**Avant:** Utilisait `CandidateProfile` (camelCase)
```typescript
const [formData, setFormData] = useState<CandidateProfile>({});
```

**Après:** Utilise `CandidateFormData` (snake_case)
```typescript
interface CandidateFormData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  current_title?: string;
  years_experience?: string | number;
  education_level?: string;
  skills?: string;
  languages?: string;
  desired_positions?: string;
  desired_sectors?: string;
  desired_locations?: string;
  min_salary?: string | number;
  contract_types?: string[];
  linkedin_url?: string;
  portfolio_url?: string;
  [key: string]: any;
}

const [formData, setFormData] = useState<CandidateFormData>({});
```

### 2. **Completion Message** (ChatOnboarding.tsx)

**Avant:**
```typescript
formData.firstName || 'candidat'
```

**Après:**
```typescript
(formData.first_name as string) || 'candidat'
```

### 3. **Chat Configuration** (lib/chat-config.ts)

**17 Questions avec fieldNames en snake_case:**

```typescript
export const CHAT_FLOW: ChatQuestion[] = [
  {
    text: 'Bienvenue! Quel est ton prénom?',
    emoji: '👋',
    fieldName: 'first_name',    // ← snake_case
    type: 'text',
    placeholder: 'Ex: Paul',
    tip: 'Utilise ton prénom réel',
  },
  // ... 16 autres questions avec snake_case fieldNames
];
```

### 4. **Validation Functions** (lib/chat-config.ts)

**Avant:** Type incompatibilité sur les validations
```typescript
validation: (value: string) => { ... }
```

**Après:** Accepte any pour compatibilité avec multiselect
```typescript
validation: (value: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(value));
}
```

---

## Data Flow Complet

```
User fills chat form (17 questions)
      ↓
ChatOnboarding collects data
      ↓
formData = {
  first_name: "Paul",
  last_name: "Kamgang",
  email: "paul@example.com",
  // ... 14 autres champs en snake_case
}
      ↓
submitProfile() POST /api/profiles
      ↓
API Route (app/api/profiles/route.ts)
      ↓
Validation & Conversion:
  - Parse: years_experience "5" → 5
  - Parse: min_salary "500000" → 500000
  - Split: skills "Python, JS" → ["Python", "JS"]
  - Arrays: contract_types → ["CDI", "Consulting"]
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
  skills: ["Python", "JavaScript"],
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
✅ Data saved to job_automation_db.candidates
```

---

## 17 Questions du Chat

| # | Question | Field | Type | Requis |
|---|----------|-------|------|--------|
| 1 | Quel est ton prénom? | first_name | text | ✅ |
| 2 | Et ton nom de famille? | last_name | text | ✅ |
| 3 | Quel est ton email? | email | email | ✅ |
| 4 | Ton numéro de téléphone? | phone | tel | ❌ |
| 5 | Où es-tu basé? | location | text | ❌ |
| 6 | Quel est ton titre professionnel? | current_title | text | ❌ |
| 7 | Combien d'années d'expérience? | years_experience | number | ❌ |
| 8 | Quel est ton niveau d'études? | education_level | select | ❌ |
| 9 | Quelles sont tes compétences? | skills | text (array) | ❌ |
| 10 | Quelles langues parles-tu? | languages | text (array) | ❌ |
| 11 | Quels postes souhaites-tu? | desired_positions | text (array) | ❌ |
| 12 | Quels secteurs t'intéressent? | desired_sectors | text (array) | ❌ |
| 13 | Quelles localisations préfères-tu? | desired_locations | text (array) | ❌ |
| 14 | Quel salaire minimum? | min_salary | number | ❌ |
| 15 | Quels types de contrats? | contract_types | multiselect | ❌ |
| 16 | URL vers LinkedIn? | linkedin_url | text | ❌ |
| 17 | URL vers portfolio? | portfolio_url | text | ❌ |

---

## Testing

### 1. SSH Tunnel
```bash
./scripts/ssh-tunnel.sh
# Keep this open
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Go to Chat
```
http://localhost:3000/onboarding
```

### 4. Fill Form Manually or Test with curl:
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

### 5. Verify in Database
```bash
ssh root@88.222.221.7
docker exec n8n-postgres bash -c "PGPASSWORD='__n8n_BLANK_VALUE_e5362baf-c777-4d57-a609-6eaf1f9e87f6' psql -U n8n_user -d job_automation_db -c \"SELECT * FROM candidates ORDER BY created_at DESC LIMIT 1;\""
```

---

## Files Modified

| File | Status | Changes |
|------|--------|---------|
| `components/ChatOnboarding.tsx` | ✅ Modified | Type updated, snake_case fieldNames |
| `lib/chat-config.ts` | ✅ Modified | 17 questions, snake_case, validation fixes |
| `app/api/profiles/route.ts` | ✅ Modified | Uses `prisma.candidate` model |
| `prisma/schema.prisma` | ✅ Created | 11 models with snake_case fields |
| `CHAT_INTEGRATION.md` | ✅ Created | Complete integration guide |
| `FRONTEND_ADAPTATION_SUMMARY.md` | ✅ Created | This file |

---

## Ready for GitHub

Tout est prêt pour GitHub et Vercel:

✅ Chat frontend adapté
✅ API endpoints fonctionnels
✅ Database schema complet
✅ SSH tunnel configuré
✅ Documentation complète

**Prochaine étape:** Git push → GitHub → Vercel deployment

---

## Notes

- **snake_case everywhere**: Matching exact BD field names
- **No camelCase**: All fields are snake_case for consistency
- **Validation**: Email et phone ont regex
- **Arrays**: Strings virgule-séparées → arrays (handled by API)
- **Numbers**: Strings "5" → integers 5
- **Required**: Only first_name + email required
