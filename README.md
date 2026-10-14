# CampusRate API

API REST de gestion et d'évaluation des espaces du campus universitaire, développée avec NestJS, TypeScript et MongoDB dans le cadre du cours 420-514 (TP2).

---

## Sommaire

- [À propos du projet](#à-propos-du-projet)
- [Justification du Design REST](#justification-du-design-rest)
- [Fonctionnalités & Règles Métier](#fonctionnalités--règles-métier)
- [Architecture & Persistance MongoDB](#architecture--persistance-mongodb)
- [Technologies & Dépendances](#technologies--dépendances)
- [Configuration & Variables d'Environnement](#configuration--variables-denvironnement)
- [Installation & Démarrage](#installation--démarrage)
- [Validation, Build & Qualité](#validation-build--qualité)
- [Documentation OpenAPI / Swagger](#documentation-openapi--swagger)
- [Gestion des Erreurs (RFC 7807 / RFC 9457)](#gestion-des-erreurs-rfc-7807--rfc-9457)
- [Fonctionnalités Optionnelles (30/30 pts)](#fonctionnalités-optionnelles-3030-pts)
- [Structure du Projet](#structure-du-projet)
- [Limites Connues](#limites-connues)

---

## À propos du projet

CampusRate offre une API REST structurée permettant aux étudiants de consulter les différents lieux du campus (espaces de travail, bibliothèques, services de restauration, etc.) et d'y publier leurs évaluations.

Points clés de l'application :
- Découpage modulaire sous NestJS.
- Persistance des données via Mongoose / MongoDB Atlas.
- Contrôle rigoureux et validation stricte des données entrantes (DTOs et `ValidationPipe`).
- Calcul dynamique des métriques d'évaluation via agrégation MongoDB.
- Format de réponse d'erreur uniformisé selon la norme RFC 7807 / RFC 9457 (Problem Details).
- Documentation interactive accessible via Swagger / OpenAPI.

---

## Justification du Design REST

| Décision de design | Choix appliqué | Justification |
| :--- | :--- | :--- |
| **Nommage des ressources** | Pluriel, anglais, minuscules (`/places`, `/reviews`) | Suivi des conventions REST basées sur des collections de ressources représentées par des noms. |
| **Relations entre ressources** | `/places` et `/reviews` liés par `placeId` (référence) | Garantit une gestion indépendante des entités tout en maintenant l'association claire entre un avis et son endroit. |
| **Codes de succès** | `201 Created`, `200 OK`, `204 No Content` | Alignement avec la sémantique HTTP : `201` indique la création effective, `204` confirme une suppression. |
| **Codes d'erreur** | `400 Bad Request`, `404 Not Found`, `409 Conflict` | Distinction nette entre un problème de validation (`400`), une ressource absente (`404`) ou un conflit (`409`). |

---

## Fonctionnalités & Règles Métier

### Endroits du campus (`/places`)
- **Propriétés gérées** : `id`, `name`, `description`, `category`, `location`, `createdAt`.
- **Endpoints disponibles** :
  - `POST /places` : Création d'un nouvel endroit avec validation stricte.
  - `GET /places` : Extraction de la liste des endroits avec filtres et pagination.
  - `GET /places/:id` : Récupération d'un endroit spécifique.
  - `PATCH /places/:id` : Édition partielle d'un endroit.
  - `DELETE /places/:id` : Suppression d'un endroit.

### Avis & Évaluations (`/reviews`)
- **Propriétés gérées** : `id`, `placeId`, `rating` (entre 1 et 5), `comment`, `createdAt`.
- **Endpoints disponibles** :
  - `POST /reviews` : Publication d'un avis rattaché à un `placeId`.
  - `GET /reviews` : Consultation de la liste globale des évaluations.
  - `GET /reviews/stats/:placeId` : Statistiques agrégées des avis pour un lieu.
  - `DELETE /reviews/:id` : Retrait d'un avis.

---

## Architecture & Persistance MongoDB

La persistance des données repose sur **MongoDB** et l'ODM **Mongoose** :
- **Connexion Atlas** : L'application se connecte à un cluster MongoDB via la variable `MONGODB_URI`.
- **Modélisation** : Utilisation de schémas Mongoose pour structurer les documents `Place` et `Review`.

---

## Technologies & Dépendances

Le projet intègre les dépendances de base de NestJS ainsi que les packages de sécurité et d'optimisation ajoutés pour le TP2 :
- **Framework** : `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`, `@nestjs/config`
- **Base de données** : `@nestjs/mongoose`, `mongoose`
- **Validation & Sécurité** : `class-validator`, `class-transformer`, `@nestjs/throttler`, `helmet`
- **Documentation** : `@nestjs/swagger`
- **Qualité de code** : Oxlint, Prettier

---

## Configuration & Variables d'Environnement

Créez un fichier `.env` à la racine du projet en vous basant sur la structure suivante :

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campus-rate?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:3000

Installation & Démarrage
1. Cloner le projet
git clone [https://github.com/Alben11/campus-rate.git](https://github.com/Alben11/campus-rate.git)
cd campus-rate
2. Installer les dépendances
npm install
3. Démarrer l'application
Mode développement (avec rechargement automatique) :

npm run start:dev
Mode production :

npm run build
npm run start:prod
Validation, Build & Qualité
# Analyse et lintage du code
npm run lint

# Formatage automatique
npm run format

# Vérification de la compilation TypeScript
npm run build
Documentation OpenAPI / Swagger
L'interface Swagger UI est accessible à l'adresse suivante lorsque le serveur est démarré :

 http://localhost:3000/api/docs

Gestion des Erreurs (RFC 7807 / RFC 9457)
L'ensemble des exceptions est capturé via un filtre global qui renvoie une réponse formatée sous l'en-tête application/problem+json.

Fonctionnalités Optionnelles Implantées (30 / 30 points)
M1 (Indexation MongoDB - +6 pts) : Index unique sur le nom des lieux et index de performance sur les identifiants de liaison.

M2 (Agrégation MongoDB - +4 pts) : Pipeline d'agrégation ($match, $group, $avg) pour calculer dynamiquement les statistiques des avis.

M3 (Justification Référence vs Imbrication - +2 pts) : Utilisation de références par ID (Types.ObjectId) pour garantir l'indépendance des cycles de vie et éviter la limite de taille des documents MongoDB (16 Mo).

MMP / Sécurité HTTP (H1, H2, H4, H5 - +9 pts) : Rate Limiting global (@nestjs/throttler), limitation de la taille du corps HTTP (1 Mo), restriction CORS par environnement et méthodes HTTP explicites.

T1 (HTTPS / TLS - +1 pt) : Rôle du chiffrement des communications en transit pour prévenir les attaques Man-in-the-Middle.

L1 (Journalisation INFO - +3 pts) : Intercepteur global de logs des opérations HTTP.

P2 (Validation stricte - +2 pts) : Filtrage strict des propriétés modifiables (whitelist: true, forbidNonWhitelisted: true).

Structure du Projet

campus-rate/
├── src/
│   ├── common/             # Intercepteurs, filtres d'exceptions
│   ├── places/             # Module des endroits (contrôleur, service, schéma, DTOs)
│   ├── reviews/            # Module des avis (contrôleur, service, schéma, DTOs)
│   ├── app.module.ts
│   └── main.ts
├── .env
├── README.md
└── package.json

Limites Connues
1. Authentification & Rôles : L'authentification par JWT et la gestion des rôles (A1/A2) n'ont pas été implémentées dans cette version, l'effort s'étant concentré sur la sécurité HTTP, la validation et l'agrégation MongoDB.

2. Multimédia : Le stockage de fichiers ou d'images pour les lieux n'est pas pris en charge (gestion textuelle uniquement).