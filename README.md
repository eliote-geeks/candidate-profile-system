# 🚀 RecruitAI - Candidate Profile System

Système moderne d'onboarding candidat avec interface chat conversationnelle alimentée par l'IA.

## 📋 Features

✅ **Interface Chat Conversationnelle**
- Questions progressives (une par une)
- Validation en temps réel
- Messages dynamiques et personnalisés
- Emojis et micro-animations

✅ **Design Modern 2025**
- Gradient colors (indigo → purple)
- Glassmorphism effects
- Micro-interactions smooth
- Responsive mobile-first
- Dark mode ready

✅ **Collecte de Données Complète**
- Infos personnelles
- Expérience professionnelle
- Compétences & langues
- Éducation
- Préférences de travail

✅ **Performance Optimisée**
- Next.js 15 avec App Router
- Framer Motion pour animations
- Tailwind CSS for styling
- TypeScript for type safety

## 🛠️ Stack Technique

- **Framework:** Next.js 15 (TypeScript)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** Inter + JetBrains Mono (Google Fonts)

## 📁 Structure du Projet

```
candidate-profile-system/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (Chat)
│   └── globals.css         # Global styles
├── components/
│   └── ChatOnboarding.tsx   # Main chat component
├── types/
│   └── chat.ts             # TypeScript types
├── lib/
│   └── chat-config.ts      # Chat questions & config
└── public/                 # Static assets
```

## 🚀 Démarrage Rapide

### 1. Installation

```bash
# Clone ou télécharge le dossier
cd candidate-profile-system

# Install dependencies
npm install
```

### 2. Lancer le dev server

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

### 3. Éditer et tester

Les fichiers principaux à modifier:
- `components/ChatOnboarding.tsx` - Logique du chat
- `lib/chat-config.ts` - Questions et configuration
- `app/globals.css` - Styles globaux

Les changements se mettent à jour automatiquement (hot reload).

## 🎨 Personnalisation

### Changer les couleurs

Édite `components/ChatOnboarding.tsx`:
```tsx
// Remplace les classes Tailwind
bg-gradient-to-r from-indigo-600 to-purple-600
// Avec tes propres couleurs
```

### Ajouter des questions

Ajoute un nouvel objet dans `lib/chat-config.ts`:
```ts
{
  id: 'step_XX_fieldname',
  text: 'Ta question ici ?',
  emoji: '💡',
  fieldName: 'fieldName',
  type: 'text' | 'email' | 'select',
  placeholder: 'Placeholder texte',
  validation: (v) => v.length > 0,
  tip: 'Conseil optionnel',
}
```

### Changer les messages

Édite `CHAT_FLOW`, `WELCOME_MESSAGE`, `COMPLETION_MESSAGE` dans `lib/chat-config.ts`.

## 📦 Build & Deploy

### Build pour production

```bash
npm run build
```

### Tester le build localement

```bash
npm run build
npm run start
```

### Deploy sur Vercel

```bash
# Push sur GitHub d'abord
git push origin main

# Via Vercel Dashboard
# 1. Connecte-toi à https://vercel.com
# 2. Import du projet GitHub
# 3. Deploy (auto avec chaque push)
```

## 🔌 Intégration avec n8n

### Backend API (À venir)

Pour envoyer les données du profil vers n8n:

```ts
// Dans handleSubmit (ChatOnboarding.tsx)
const submitProfile = async () => {
  const response = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const { userId } = await response.json();

  // Trigger n8n webhook
  await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      event: 'candidate_profile_created',
      userId,
      candidateData: formData,
    }),
  });
};
```

## 📱 Mobile Responsiveness

- ✅ Full responsive design
- ✅ Touch-friendly inputs
- ✅ Optimized for small screens
- ✅ Keyboard navigation

## ♿ Accessibility

- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Respects prefers-reduced-motion
- ✅ Proper color contrast

## 🐛 Troubleshooting

### Erreur: "Module not found"

```bash
npm install
npm run dev
```

### Framer Motion ne fonctionne pas

Vérifie que `'use client'` est en haut du fichier ChatOnboarding.tsx

### Styles Tailwind ne s'appliquent pas

```bash
# Rebuild Tailwind cache
rm -rf .next
npm run dev
```

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

MIT - Libre d'utilisation

## 🤝 Support

Pour des questions ou problèmes:
1. Vérifie les fichiers de config
2. Réinstalle les dépendances (`npm install`)
3. Redémarre le dev server (`npm run dev`)

---

**Version:** 1.0.0
**Dernière mise à jour:** 2025-10-30
**Made with ❤️ for job automation**
