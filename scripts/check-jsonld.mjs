/* Contrôle de build : le JSON-LD émis doit être du JSON strictement valide. */
import { readFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const bloc = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

if (!bloc) {
  console.error('✗ Aucun bloc JSON-LD trouvé dans dist/index.html');
  process.exit(1);
}

const donnees = JSON.parse(bloc[1]);
console.log('✓ JSON-LD valide\n');
console.log(JSON.stringify(donnees, null, 2));
