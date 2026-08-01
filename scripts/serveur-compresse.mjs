/* Serveur statique de contrôle : sert dist/ en brotli, comme le fera Vercel.
   `astro preview` ne compresse pas, ce qui fausse toute mesure Lighthouse
   locale du temps réseau. Usage : node scripts/serveur-compresse.mjs [port] */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { brotliCompressSync, constants } from 'node:zlib';

const port = Number(process.argv[2] || 4393);
const racine = 'dist';
const cache = new Map();

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

/* Seuls les formats texte gagnent à être compressés : images et polices
   sont déjà des conteneurs compressés. */
const compressibles = new Set(['.html', '.js', '.css', '.svg', '.xml', '.txt']);

createServer((req, res) => {
  let chemin = decodeURIComponent(req.url.split('?')[0]);
  if (chemin.endsWith('/')) chemin += 'index.html';
  let fichier = join(racine, normalize(chemin).replace(/^(\.\.[/\\])+/, ''));

  if (!existsSync(fichier) || !statSync(fichier).isFile()) {
    if (existsSync(fichier + '/index.html')) fichier = fichier + '/index.html';
    else if (existsSync(fichier + '.html')) fichier = fichier + '.html';
    else {
      res.writeHead(404);
      return res.end('introuvable');
    }
  }

  const ext = extname(fichier);
  const type = types[ext] || 'application/octet-stream';
  const accepteBrotli = (req.headers['accept-encoding'] || '').includes('br');

  if (compressibles.has(ext) && accepteBrotli) {
    if (!cache.has(fichier)) {
      cache.set(
        fichier,
        brotliCompressSync(readFileSync(fichier), {
          params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
        })
      );
    }
    const corps = cache.get(fichier);
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Encoding': 'br',
      'Content-Length': corps.length,
      'Cache-Control': 'public, max-age=31536000',
    });
    return res.end(corps);
  }

  const corps = readFileSync(fichier);
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': corps.length,
    'Cache-Control': 'public, max-age=31536000',
  });
  res.end(corps);
}).listen(port, () => console.log('dist/ servi en brotli sur http://localhost:' + port));
