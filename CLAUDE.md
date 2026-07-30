# CLAUDE.md — MLD DEV

Contexte permanent du projet. Relis ce fichier avant chaque tâche.

## Projet

Refonte du site vitrine de **MLD DEV**, agence de création de sites vitrines basée à Roanne (Loire, 42), fondée par Maxime. Direction artistique « Galerie d'Art », **déjà validée** : elle s'applique à la lettre, elle ne se réinterprète pas.

## Stack

- Astro 5 (composants `.astro`, structure standard)
- Tailwind CSS 4 — ⚠️ **pas de `tailwind.config.js`**, les tokens vivent dans `@theme` (voir `src/styles/global.css`)
- `@fontsource/plus-jakarta-sans` (700/800/900) et `@fontsource/inter` (400/500) — **jamais le CDN Google Fonts** (perf + RGPD)
- GSAP + ScrollTrigger, Lenis pour le smooth scroll
- Web3Forms pour le formulaire
- `@astrojs/sitemap`

## Tokens de design

```css
@theme {
  --color-paper:  #EDEBE9;  /* Fond principal — 60% */
  --color-carbon: #1A1A1A;  /* Texte & structure — 30% */
  --color-accent: #FF6600;  /* Accent, actions clés — 10% */

  --font-display: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-body:    "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

Utilise **toujours** les classes sémantiques : `bg-paper`, `text-carbon`, `border-carbon/10`, `text-accent`, `font-display`, `font-body`. Les valeurs hexadécimales en dur (`bg-[#EDEBE9]`) sont interdites.

## Règles de DA

- Style architectural, galerie d'art. Beaucoup de white space.
- Sections séparées par des **filets ultra-fins** : `border-carbon/10`.
- **Aucune ombre portée**, **aucun gros arrondi** : `rounded-none`, `rounded-sm` au maximum.
- Visuels encadrés d'un filet fin anthracite.
- Jamais de noir pur `#000000`.
- Orange **uniquement** sur les éléments d'action clés : un CTA, un prix, une puce de validation. Jamais deux usages de l'orange dans le même bloc.
- Logo textuel : `MLD DEV.` en `font-display font-black text-carbon`, **le point final en `text-accent`**.

## Contraste — règle impérative

Texte blanc sur `#FF6600` = ratio 2,9:1 → **échoue au WCAG AA**.
Sur tout fond orange, le texte est en **`text-carbon`** (ratio ≈ 5,9:1). Seule exception : texte ≥ 24px bold.

## Responsive — mobile, tablette, desktop

Approche **mobile-first** : les styles de base ciblent le mobile, les variantes `md:` et `lg:` viennent ensuite.

| Breakpoint | Largeur | Cible |
|---|---|---|
| base | < 640px | mobile |
| `md:` | ≥ 768px | tablette |
| `lg:` | ≥ 1024px | desktop |
| `xl:` | ≥ 1280px | grand écran |

Règles systématiques :

- **Grilles asymétriques** (Hero, projets, contact) : une seule colonne jusqu'à `lg`, deux colonnes à partir de `lg`. Un split 45/55 est illisible sur tablette — ne le déclenche pas en `md`.
- **L'image passe toujours au-dessus du texte** en mobile et tablette, quel que soit l'ordre desktop (utilise `order-first lg:order-none`).
- **Les filets verticaux deviennent horizontaux** sous `lg` : `border-t border-carbon/10 lg:border-t-0 lg:border-l`.
- **Colonnes de cartes** (services, avis) : 1 colonne en mobile, 2 en `md`, 3 en `lg`.
- **Padding horizontal** : `px-6 md:px-10 lg:px-16 xl:px-24`.
- **Padding vertical** : `py-16 md:py-24 lg:py-32`.
- **Typographie fluide** via `clamp()` sur les titres, pas d'empilement de `text-4xl md:text-6xl lg:text-8xl`. Exemple H1 : `clamp(2.5rem, 8vw, 6rem)`, avec `leading-[0.95]`.
- **Cibles tactiles** ≥ 44 × 44px sur tout élément cliquable en mobile et tablette.
- **Pas de scroll horizontal.** Le watermark plein bord est le principal risque de débordement : vérifie-le explicitement à 375px.
- **Menu burger visible en dessous de `lg`** (donc mobile *et* tablette) : `lg:hidden` sur le burger, `hidden lg:flex` sur la navigation desktop.
- Vérifie chaque composant à **375px, 768px, 1024px et 1440px** avant de le déclarer terminé.

## Conventions de code

- Commentaires **en français** : un commentaire d'en-tête par composant, un par bloc interne (titre, sous-titre, CTA, image, filet…).
- Marqueurs `{/* TODO: ... */}` visibles partout où des données réelles manquent (téléphone, email, adresse, SIRET, clé API, URLs réseaux sociaux, visuels définitifs).
- Composants réutilisables : `interface Props` typée dans le frontmatter.
- **Les données restent dans le composant qui les affiche** (tableau en haut du frontmatter). Ne crée pas de `src/data/site.ts`.
- Images via `astro:assets` (`<Image />`), placeholders locaux dans `public/placeholders/`.
- Un seul `<h1>` par page, hiérarchie de titres cohérente, balises `<nav>` / `<main>` / `<section>` / `<footer>`.
- Focus clavier visible : `focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2`.
- `prefers-reduced-motion` respecté : Lenis désactivé, animations remplacées par l'état final.

## Règle de travail

**Ne réécris jamais un composant déjà validé** pour en construire un nouveau. Tu travailles composant par composant ; à la fin de chaque tâche, tu t'arrêtes et tu attends ma validation.

## Arborescence cible

```
src/
├── layouts/       Layout.astro, LegalLayout.astro
├── components/    Navbar, Hero, Manifeste, Realisations, ProjectCard,
│                  Services, ServiceCard, Critiques, Faq, Contact,
│                  Footer, Watermark
├── scripts/       animations.js   (fichier unique)
├── styles/        global.css      (@theme + base)
└── pages/         index.astro, mentions-legales.astro
public/            robots.txt, llms.txt, placeholders/
```
