# ARIA — checkpoint de préparation bêta — 21 novembre 2026

Ce checkpoint est issu du ZIP `aria_installation_en_allemagne.zip`. Il conserve les six rubriques et leur architecture existante. Il ne constitue pas encore une bêta validée sur téléphone.

## Corrections présentes

- Backend : transmission explicite de `GEMINI_API_KEY` (repli `GOOGLE_API_KEY`), modèle configurable `GEMINI_MODEL` avec `gemini-3.8-flash` par défaut, gestion distincte des indisponibilités/quota/HTTP 503.
- Gemini 3.8 Flash : retrait des anciens paramètres `temperature`.
- Chat : injection des ressources locales pertinentes dans le contexte de Gemini.
- Recherche hors ligne : nouveau `src/services/offlineSearchService.ts`, qui indexe les 8 procédures administratives, les 7 fiches hors ligne, les lieux, les numéros d'urgence et les 5 modules d'allemand (vocabulaire, dialogues, exercices et explications).
- Recherche FR/DE : accents, ä→ae, ö→oe, ü→ue, ß→ss et synonymes courants.
- Les résultats locaux sont présentés comme des références du projet, pas comme une validation juridique actuelle. Les coordonnées et horaires sont également signalés comme potentiellement périmés.
- Assistant documentaire : OCR photo explicitement en ligne ; l'analyse locale de texte ne prétend plus confirmer des obligations, montants ou délais. Elle repère uniquement les éléments littéralement présents.
- Carte : distinction claire entre lieux intégrés, fond cartographique et itinéraires qui ne sont pas garantis hors connexion.
- Stockage : aucun pack de carte n'est marqué téléchargé par défaut.
- Sécurité : `.env` et `.env.txt` de l'archive source exclus ; seul `.env.example` fictif est conservé.

## Contrôles et limites

- Inspection du code source et des structures de données effectuée.
- `npm ci --no-audit --no-fund` a dépassé le délai dans l'environnement d'audit : les dépendances ne sont pas installées.
- `tsc --noEmit` a été tenté mais ne peut pas démarrer l'analyse du projet sans `vite/client` et `vite-plugin-pwa/client`.
- Compilation Vite non validée ici. Aucun appel réel à Gemini n'a été effectué.
- La clé présente dans l'archive source doit être révoquée et remplacée avant tout déploiement ou partage.

## Tests indispensables avant bêta

1. Sur le PC Windows : `npm ci`, `npm run lint`, puis `npm run build`.
2. Configurer une nouvelle `GEMINI_API_KEY` dans les secrets serveur uniquement ; tester `/api/chat` et `/api/analyze-document`.
3. Tester clé absente, quota atteint, erreur 503 et perte de réseau.
4. Tester les recherches hors ligne : Anmeldung, visa, banque, assurance, urgences, Au-Pair, FSJ/BFD, ambassade, lieux et exercices d'allemand.
5. Tester analyse de texte hors ligne et photo sans réseau : aucune photo ne doit être présentée comme lue hors ligne.
6. Installer la PWA sur Android, couper réellement le réseau et vérifier les six rubriques et les données conservées.
7. Revalider les informations légales, montants, coordonnées et horaires auprès des sources officielles.
8. Comparer ce checkpoint au second ZIP Google AI Studio si celui-ci devient disponible, avant toute fusion supplémentaire.
