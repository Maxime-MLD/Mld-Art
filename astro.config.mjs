// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Configuration Astro 5 — Tailwind CSS 4 est branché via le plugin Vite officiel
// (la v4 n'a plus d'intégration Astro dédiée ni de tailwind.config.js).
export default defineConfig({
  // Domaine canonique du site : indispensable pour le sitemap et les balises canonical
  site: 'https://www.mld-dev.com',

  integrations: [
    // Génération automatique de sitemap-index.xml au build
    sitemap({
      // La page de mentions légales est en noindex : on l'exclut aussi du sitemap
      filter: (page) => !page.includes('/mentions-legales'),
    }),
  ],

  // Barre d'outils de dev masquée : elle se superpose au bas de page et gêne
  // le contrôle visuel du watermark en pied de site.
  devToolbar: {
    enabled: false,
  },

  build: {
    // La feuille de styles fait une dizaine de kilo-octets : servie en fichier
    // séparé, elle bloque le rendu le temps d'un aller-retour réseau (180 ms
    // mesurés au Lighthouse mobile). Inlinée, elle arrive avec le HTML.
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
