# ATDJ Control

Tableau de bord privé de gestion et d'analyse de **À Thouars de Jouer**.

## Architecture
- Interface statique publiée avec GitHub Pages.
- Authentification Supabase.
- Autorisation par liste d'e-mails dans `public.dashboard_allowed_users` (RLS activée).
- Statistiques du site principal récupérées par une Edge Function côté serveur.
- Les clés secrètes ne sont jamais intégrées au navigateur ni au dépôt GitHub.

## Configuration à terminer dans Supabase

Projet du tableau de bord : `gksiatlrpionalhpqxkc`

Dans **Project Settings → Edge Functions → Secrets**, ajoute :
- `ATDJ_SOURCE_URL` = `https://caqghciujoyncsudltgr.supabase.co`
- `ATDJ_SOURCE_SECRET_KEY` = la clé secrète du projet Supabase principal À Thouars de Jouer.

Ne partage jamais cette clé dans un chat, un dépôt GitHub ou le fichier `config.js`.

Dans **Authentication → Users**, crée les comptes des personnes autorisées. Dans la table `public.dashboard_allowed_users`, ajoute les mêmes e-mails en minuscules et avec `is_active = true`. La liste d'autorisation est consultée avec RLS.

Désactive les nouvelles inscriptions publiques dans les réglages Auth du projet dashboard ; les comptes sont créés par l'administrateur seulement.

## GitHub Pages
Le workflow `.github/workflows/pages.yml` publie le dossier racine sur GitHub Pages à chaque push sur `main`. Dans **Settings → Pages**, sélectionne **GitHub Actions** comme source si ce n'est pas déjà fait.
