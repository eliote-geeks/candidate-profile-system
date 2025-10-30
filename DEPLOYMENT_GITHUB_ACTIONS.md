# GitHub Actions Auto-Deployment Guide

Ce guide explique comment configurer le déploiement automatique sur ton VPS via GitHub Actions.

## 🔧 Configuration requise

### 1. Ajouter les secrets GitHub

Va sur **GitHub Repository Settings → Secrets and variables → Actions**

Ajoute les 3 secrets suivants:

#### `VPS_HOST`
- **Valeur**: `88.222.221.7`
- **Description**: Adresse IP de ton VPS

#### `VPS_USER`
- **Valeur**: `root`
- **Description**: Nom d'utilisateur SSH du VPS

#### `VPS_SSH_KEY`
- **Valeur**: Ton contenu de clé SSH privée
- **Comment obtenir**:
  ```bash
  cat ~/.ssh/id_ed25519
  # Ou si tu utilises RSA:
  cat ~/.ssh/id_rsa
  ```
- **⚠️ IMPORTANT**: Assure-toi que ta clé SSH est déjà configurée sur le VPS pour authentification sans mot de passe

### 2. Vérifier la clé SSH sur le VPS

Assure-toi que ta clé publique est dans le fichier d'autorisation du VPS:

```bash
ssh root@88.222.221.7 "cat ~/.ssh/authorized_keys | grep -i 'votre-cle'"
```

Si rien n'apparaît, ajoute ta clé publique:

```bash
cat ~/.ssh/id_ed25519.pub | ssh root@88.222.221.7 "cat >> ~/.ssh/authorized_keys"
```

## 🚀 Utilisation

Une fois les secrets configurés, le déploiement se fera **automatiquement** à chaque push sur la branche `main`:

```bash
git add .
git commit -m "ta description"
git push origin main
```

Le workflow GitHub Actions va:
1. ✅ Télécharger le code depuis GitHub
2. ✅ Se connecter au VPS via SSH
3. ✅ Tirer le code avec `git pull`
4. ✅ Reconstruire l'image Docker
5. ✅ Redémarrer les services

## 📋 Historique des déploiements

Tu peux voir l'historique des déploiements dans:
**GitHub Repository → Actions → Deploy to VPS**

## 🔒 Sécurité

- Les secrets sont chiffrés et ne sont jamais visibles dans les logs
- Chaque exécution crée un nouveau container (isolation)
- La clé SSH n'est utilisée que pour la connexion, pas stockée

## 🆘 Dépannage

### Le workflow échoue avec "Permission denied"
- Vérifie que `VPS_SSH_KEY` contient la bonne clé privée
- Assure-toi que la clé publique est dans `~/.ssh/authorized_keys` du VPS

### Le workflow timeout
- Le build Docker peut prendre longtemps
- Augmente le timeout si nécessaire

### L'application ne démarre pas après le déploiement
- Vérifie les logs du container:
  ```bash
  docker logs recruit-app
  ```

## 📝 Fichiers concernés

- `.github/workflows/deploy.yml` - Workflow du déploiement
- `Dockerfile` - Configuration Docker pour Next.js
- `docker-compose.recruit.yml` - Services Docker (sur le VPS)

## 🎯 Prochaines étapes

1. Ajoute les 3 secrets GitHub
2. Fais un test de push pour vérifier que le déploiement fonctionne
3. Vérifie les logs dans GitHub Actions
