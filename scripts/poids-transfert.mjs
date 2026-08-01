/* Poids réel de transfert : `astro preview` sert sans compression, alors que
   Vercel sert en brotli. Ce script mesure l'écart, pour savoir ce que le
   Lighthouse local sous-estime. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';

const fichiers = readdirSync('dist/_astro').filter((f) => /\.(js|css)$/.test(f));
const html = ['dist/index.html'];

let brut = 0;
let brotli = 0;

console.log('fichier'.padEnd(56), 'brut'.padStart(9), 'gzip'.padStart(9), 'brotli'.padStart(9));

for (const chemin of [...html, ...fichiers.map((f) => 'dist/_astro/' + f)]) {
  const buf = readFileSync(chemin);
  const g = gzipSync(buf).length;
  const b = brotliCompressSync(buf, {
    params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
  }).length;
  brut += buf.length;
  brotli += b;
  const ko = (n) => (n / 1024).toFixed(1) + ' ko';
  console.log(
    chemin.replace('dist/', '').padEnd(56),
    ko(buf.length).padStart(9),
    ko(g).padStart(9),
    ko(b).padStart(9)
  );
}

console.log('');
console.log('Total brut   :', (brut / 1024).toFixed(1), 'ko');
console.log('Total brotli :', (brotli / 1024).toFixed(1), 'ko');
console.log('Économie     :', (100 - (brotli / brut) * 100).toFixed(0), '%');
