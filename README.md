# CampusRate API

API REST de gestion et d'évaluation des espaces du campus universitaire, développée avec NestJS et TypeScript dans le cadre du cours 420-514.

---

## Sommaire

- [À propos du projet](#à-propos-du-projet)
- [Justification du Design REST](#justification-du-design-rest)
- [Fonctionnalités & Règles Métier](#fonctionnalités--règles-métier)
- [Architecture & Persistance JSON](#architecture--persistance-json)
- [Technologies & Outils](#technologies--outils)
- [Configuration & Variables d'Environnement](#configuration--variables-denvironnement)
- [Installation & Démarrage](#installation--démarrage)
- [Validation, Build & Qualité](#validation-build--qualité)
- [Documentation OpenAPI / Swagger](#documentation-openapi--swagger)
- [Gestion des Erreurs (RFC 7807 / RFC 9457)](#gestion-des-erreurs-rfc-7807--rfc-9457)
- [Structure du Projet](#structure-du-projet)
- [Limites Connues](#limites-connues)

---

## À propos du projet

CampusRate offre une API REST structurée permettant aux étudiants de consulter les différents lieux du campus (espaces de travail, bibliothèques, services de restauration, etc.) et d'y publier leurs évaluations.

Points clés de l'application :
- Découpage modulaire sous NestJS.
- Contrôle rigoureux des données reçues (DTOs et paramètres de requêtes).
- Calcul dynamique des métriques d'évaluation (averageRating et reviewCount).
- Sauvegarde asynchrone des données au sein de fichiers JSON locaux.
- Format de réponse d'erreur uniformisé selon la norme RFC 7807 / RFC 9457 (Problem Details).
- Documentation interactive accessible via Swagger / OpenAPI.

---

## Justification du Design REST

Afin de respecter les standards d'architecture HTTP exigés par l'énoncé, voici un récapitulatif des choix de conception retenus :

| Décision de design | Choix appliqué | Justification |
| :--- | :--- | :--- |
| **Nommage des ressources** | Pluriel, anglais, minuscules (`/places`, `/reviews`) | Suivi des conventions REST basées sur des collections de ressources représentées par des noms. |
| **Relations entre ressources** | `/places` et `/reviews` liés par `placeId` | Garantit une gestion indépendante des entités tout en maintenant l'association claire entre un avis et son endroit. |
| **Codes de succès** | `201 Created`, `200 OK`, `204 No Content` | Alignement avec la sémantique HTTP : `201` indique la création effective d'un enregistrement, tandis que `204` confirme une suppression sans contenu de retour. |
| **Codes d'erreur** | `400 Bad Request`, `404 Not Found`, `409 Conflict` | Distinction nette entre un problème de validation d'entrée (`400`), une ressource absente (`404`) ou une incohérence d'état (`409`). |

---

## Fonctionnalités & Règles Métier

### Endroits du campus (`/places`)
- **Propriétés gérées** : `id`, `name`, `description`, `category`, `location`, `createdAt`.
- **Endpoints disponibles** :
  - `POST /places` : Création d'un nouvel endroit avec validation des champs.
  - `GET /places` : Extraction de la liste des endroits avec gestion de la recherche globale (`search`), du filtre par catégorie (`category`) et de la pagination (`page`, `limit`).
  - `GET /places/:id` : Récupération d'un endroit spécifique par son identifiant.
  - `PATCH /places/:id` : Édition partielle d'un endroit.
  - `DELETE /places/:id` : Suppression d'un endroit du campus.

### Avis & Évaluations (`/reviews`)
- **Propriétés gérées** : `id`, `placeId`, `rating` (entre 1 et 5), `comment`, `createdAt`.
- **Endpoints disponibles** :
  - `POST /reviews` : Publication d'un avis rattaché à un `placeId` existant.
  - `GET /reviews` : Consultation de la liste globale des évaluations.
  - `DELETE /reviews/:id` : Retrait d'un avis.

---

## Architecture & Persistance JSON

La conservation des données s'appuie sur le service `JsonPersistenceService` qui tire parti du module natif `node:fs/promises` pour interagir de façon asynchrone avec le système de fichiers.

- **Emplacement des données** : Les informations sont écrites dans `./data/places.json` et `./data/reviews.json`.
- **Création automatique** : En cas d'absence des fichiers lors de l'initialisation du serveur, ces derniers sont générés sous la forme de tableaux vides (`[]`).
- **Séparation des responsabilités** : Les services applicatifs (`PlacesService` et `ReviewsService`) ne gèrent pas l'accès direct aux fichiers et reposent entièrement sur le service de persistance.

---

## Technologies & Outils

- **Framework** : NestJS (Node.js & TypeScript)
- **Validation** : `class-validator` & `class-transformer` avec `ValidationPipe` global
- **Documentation** : `@nestjs/swagger` (OpenAPI v3)
- **Format d'erreur** : Standard RFC 7807 / RFC 9457 (Problem Details)
- **Analyse du code** : Oxlint / ESLint, Prettier

---

## Configuration & Variables d'Environnement

Un fichier modèle `.env.example` est présent à la racine du projet. Pour initialiser votre environnement local, dupliquez-le sous le nom `.env` :

```env
PORT=3000
DATA_FILE_PATH=./data

Installation & Démarrage
Prérequis requis
Node.js (version 18 ou ultérieure)

npm (installé d'office avec Node.js)

Déploiement local
Cloner le projet et se placer dans le dossier :

Bash
git clone <URL_DU_DEPOT_GITHUB>
cd campus-rate
Installer les paquets de dépendances :

Bash
npm install
Exécuter l'application :

Mode développement (avec rechargement automatique) :

Bash
npm run start:dev
Mode production :

Bash
npm run build
npm run start:prod
L'API est alors accessible à l'adresse http://localhost:3000.

Validation, Build & Qualité
Avant d'effectuer toute soumission sur Git, veillez à exécuter ces commandes afin d'assurer la conformité globale du code :

Bash
# Analyse du code par le linter
npm run lint

# Formattage automatique de la syntaxe
npm run format

# Vérification de la compilation TypeScript
npm run build
Documentation OpenAPI / Swagger
L'interface Swagger UI est générée automatiquement à chaque lancement et reste disponible à l'URL suivante :

http://localhost:3000/api/docs

Elle détaille les DTOs, les paramètres supportés, les structures de réponses ainsi que le modèle de retour des erreurs ProblemDetails.

Gestion des Erreurs (RFC 7807 / RFC 9457)
L'ensemble des exceptions est capturé au niveau central via le filtre HttpExceptionFilter, qui renvoie une réponse formatée sous l'en-tête application/problem+json.

Exemple de structure d'erreur transmise
JSON
{
  "type": "[https://httpstatuses.com/404](https://httpstatuses.com/404)",
  "title": "Not Found",
  "status": 404,
  "detail": "L'endroit avec l'ID \"id-invalide\" n'existe pas.",
  "instance": "/places/id-invalide",
  "timestamp": "2026-09-24T04:06:25.798Z"
}
Structure du Projet
Plaintext
campus-rate/
├── data/                             # Fichiers de stockage JSON
│   ├── places.json
│   └── reviews.json
├── src/
│   ├── common/                       # Composants partagés (Filtre HTTP d'exception)
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   ├── json-persistence/             # Service de persistance de données
│   │   ├── json-persistence.module.ts
│   │   └── json-persistence.service.ts
│   ├── places/                       # Gestion du module des endroits
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── places.controller.ts
│   │   ├── places.module.ts
│   │   └── places.service.ts
│   ├── reviews/                      # Gestion du module des avis
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── reviews.controller.ts
│   │   ├── reviews.module.ts
│   │   └── reviews.service.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── README.md
└── package.json
Limites Connues
1 Accès concurrents au système de fichiers : La persistance locale par fichier JSON brut n'est pas taillée pour supporter des volumes massifs d'écritures simultanées en raison de l'absence de mécanismes de verrouillage de base de données.

2 Absence d'authentification : Pour ce TP1, les accès aux routes sont ouverts et libres sans restriction par jetons de sécurité JWT ou rôles d'utilisateurs.