# Recruiting-Plateforme
Projet entreprendre 26ème édition 

Une plateforme de recrutement moderne développée avec Node.js/Express pour le backend et React/Vite pour le frontend.

## 🚀 Installation et Configuration

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- MongoDB (pour la base de données)

### 1. Cloner le projet
```bash
git clone https://github.com/aymanecodIIEs/Recruiting-Plateforme.git
cd Recruiting-Plateforme
```

### 2. Configuration du Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Créer un fichier .env avec les variables d'environnement
# Le fichier .env est déjà configuré avec MongoDB Atlas
# Si vous devez le recréer, utilisez ce format :
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/recruiting?appName=AppName
# PORT=4000
# NODE_ENV=development
# LOG_LEVEL=dev

# Démarrer le serveur de développement
npm run dev
```

Le backend sera accessible sur `http://localhost:4000`

### 3. Configuration du Frontend

```bash
# Aller dans le dossier frontend (depuis la racine du projet)
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 📁 Structure du Projet

```
Recruiting-Plateforme/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controllers/     # Contrôleurs des routes
│   │   ├── models/         # Modèles MongoDB
│   │   ├── routes/         # Définition des routes
│   │   ├── middleware/     # Middlewares personnalisés
│   │   └── config/         # Configuration de la base de données
│   ├── package.json
│   └── server.js
├── frontend/               # Application React/Vite
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── services/      # Services API
│   │   └── utils/         # Utilitaires
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🛠️ Scripts Disponibles

### Backend
- `npm start` - Démarre le serveur en production
- `npm run dev` - Démarre le serveur en mode développement avec nodemon
- `npm test` - Lance les tests

### Frontend
- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévisualise la build de production
- `npm run lint` - Lance ESLint pour vérifier le code

## 🌐 Variables d'Environnement

Créez un fichier `.env` dans le dossier `backend` avec les variables suivantes :

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/recruiting?appName=AppName
PORT=4000
NODE_ENV=development
LOG_LEVEL=dev
CV_KEY=your_gemini_api_key_here
```

## 🚀 Déploiement

### Backend
1. Configurez les variables d'environnement sur votre serveur
2. Installez les dépendances : `npm install --production`
3. Démarrez l'application : `npm start`

### Frontend
1. Construisez l'application : `npm run build`
2. Déployez le contenu du dossier `dist/` sur votre serveur web

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

Projet entreprendre 26ème édition - ENSIIE
