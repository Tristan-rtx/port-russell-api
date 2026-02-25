# Port de Plaisance Russell — API privée + Dashboard

Application Node.js/Express + MongoDB permettant de gérer :
- **Catways**
- **Réservations**
- **Utilisateurs**

L’application expose une **API privée** (authentification par **session**) et un **dashboard** (CRUD via pages EJS).

---

## Prérequis

- Node.js
- MongoDB (local)
- `mongosh` et `mongoimport`

---

## Installation

```bash
npm install
```

---

## Configuration

Créer un fichier `.env` à la racine du projet :

```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/port_russell
SESSION_SECRET=api_port_russell
```

---

## Démarrer MongoDB (macOS / Homebrew)

```bash
brew services start mongodb/brew/mongodb-community@7.0
```

Test rapide :

```bash
mongosh "mongodb://127.0.0.1:27017/port_russell" --eval "db.runCommand({ping:1})"
```

---

## Lancer l’application

```bash
npm run dev
```

Accès :

- `http://127.0.0.1:8080/`

---

## Créer / mettre à jour le compte admin

```bash
node seed-admin.js
```

Identifiants (par défaut) :
- Email : `admin@russell.fr`
- Mot de passe : `Admin1234!`

---

## Importer les données fournies (catways + reservations)

Les fichiers sont dans `./data` :
- `data/catways.json`
- `data/reservations.json`

Import :

```bash
mongoimport --jsonArray --db port_russell --collection catways --file ./data/catways.json
mongoimport --jsonArray --db port_russell --collection reservations --file ./data/reservations.json
```

---

## Pages (Frontend)

- Accueil + connexion :
  - `GET /`
- Documentation API :
  - `GET /api-doc`
- Dashboard (user + date + réservations en cours) :
  - `GET /dashboard`
- CRUD Catways :
  - `GET /dashboard/catways`
- CRUD Réservations :
  - `GET /dashboard/reservations`
- CRUD Utilisateurs :
  - `GET /dashboard/users`

---

## Notes

- Le port est configuré dans `.env` (par défaut **8080**).
- Les mots de passe sont stockés en base sous forme de hash **bcrypt**.