/* =========================================================================
   Utilitaire de développement — génération des images placeholder
   Produit des visuels neutres, aux couleurs de la charte, en attendant les
   photos définitives. À supprimer une fois tous les visuels livrés.
   Usage : node scripts/generate-placeholders.mjs
   ========================================================================= */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const PAPER = '#EDEBE9';
const CARBON = '#1A1A1A';
const ACCENT = '#FF6600';

/* Un placeholder = fond papier, filets hairline, libellé discret.
   Volontairement sobre : on doit voir le cadrage, pas l'image. */
function buildSvg({ width, height, label, ratio, cadreInterieur = true }) {
  const fontSize = Math.round(Math.min(width, height) * 0.045);
  const gap = Math.round(Math.min(width, height) * 0.08);

  /* Le cadre intérieur fait doublon quand le composant encadre déjà le visuel
     d'un filet : il donne l'illusion d'une double bordure. */
  const cadre = cadreInterieur
    ? `<rect x="${gap}" y="${gap}" width="${width - gap * 2}" height="${height - gap * 2}"
        fill="none" stroke="${CARBON}" stroke-opacity="0.12" stroke-width="1"/>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${PAPER}"/>
  ${cadre}
  <line x1="${gap}" y1="${height / 2}" x2="${width - gap}" y2="${height / 2}"
        stroke="${CARBON}" stroke-opacity="0.08" stroke-width="1"/>
  <line x1="${width / 2}" y1="${gap}" x2="${width / 2}" y2="${height - gap}"
        stroke="${CARBON}" stroke-opacity="0.08" stroke-width="1"/>
  <circle cx="${width / 2}" cy="${height / 2}" r="${fontSize * 0.28}" fill="${ACCENT}"/>
  <text x="${width / 2}" y="${height / 2 + gap * 0.9}" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}"
        font-weight="700" letter-spacing="${fontSize * 0.18}"
        fill="${CARBON}" fill-opacity="0.55">${label}</text>
  <text x="${width / 2}" y="${height / 2 + gap * 1.7}" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="${fontSize * 0.6}"
        letter-spacing="${fontSize * 0.12}"
        fill="${CARBON}" fill-opacity="0.35">${ratio}</text>
</svg>`;
}

const targets = [
  // Visuel vertical du Hero — sans cadre intérieur : le Hero l'encadre déjà
  { path: 'src/assets/placeholders/hero.jpg', width: 1200, height: 1600, label: 'VISUEL HERO', ratio: '3 : 4 — VERTICAL', cadreInterieur: false },
  // Image de partage Open Graph (doit rester dans public/ : URL absolue)
  { path: 'public/placeholders/og-image.jpg', width: 1200, height: 630, label: 'MLD DEV.', ratio: '1200 × 630 — OPEN GRAPH' },
  // Visuels des réalisations (format paysage)
  { path: 'src/assets/placeholders/projet-01.jpg', width: 1600, height: 1200, label: 'PROJET 01', ratio: '4 : 3 — PAYSAGE' },
  { path: 'src/assets/placeholders/projet-02.jpg', width: 1600, height: 1200, label: 'PROJET 02', ratio: '4 : 3 — PAYSAGE' },
  { path: 'src/assets/placeholders/projet-03.jpg', width: 1600, height: 1200, label: 'PROJET 03', ratio: '4 : 3 — PAYSAGE' },
  { path: 'src/assets/placeholders/projet-04.jpg', width: 1600, height: 1200, label: 'PROJET 04', ratio: '4 : 3 — PAYSAGE' },
  { path: 'src/assets/placeholders/projet-05.jpg', width: 1600, height: 1200, label: 'PROJET 05', ratio: '4 : 3 — PAYSAGE' },
  { path: 'src/assets/placeholders/projet-06.jpg', width: 1600, height: 1200, label: 'PROJET 06', ratio: '4 : 3 — PAYSAGE' },
];

for (const { path, width, height, label, ratio, cadreInterieur } of targets) {
  const out = resolve(process.cwd(), path);
  await mkdir(dirname(out), { recursive: true });
  await sharp(Buffer.from(buildSvg({ width, height, label, ratio, cadreInterieur })))
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(out);
  console.log(`✓ ${path} (${width}×${height})`);
}
