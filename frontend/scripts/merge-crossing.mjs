import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendRoot = join(__dirname, '..');
const hackRoot = join(frontendRoot, '..', '..', 'hackcanada');
const crossingRoot = join(frontendRoot, 'src', 'crossing');

const srcDirs = ['animations', 'assets', 'components', 'config', 'layouts', 'styles', 'types', 'utils', 'water'];

function copyDir(src, dest) {
  cpSync(src, dest, { recursive: true, force: true });
}

mkdirSync(crossingRoot, { recursive: true });

for (const dir of srcDirs) {
  const src = join(hackRoot, 'src', dir);
  const dest = join(crossingRoot, dir);
  if (!existsSync(src)) throw new Error(`Missing ${src}`);
  copyDir(src, dest);
  console.log(`copied ${dir}`);
}

copyDir(join(hackRoot, 'public'), join(frontendRoot, 'public'));
console.log('merged public/');

copyDir(join(hackRoot, 'scripts'), join(frontendRoot, 'scripts', 'crossing'));
console.log('merged scripts/');

cpSync(join(hackRoot, 'tailwind.config.mjs'), join(frontendRoot, 'crossing.tailwind.config.mjs'), { force: true });
if (existsSync(join(hackRoot, 'src', 'env.d.ts'))) {
  cpSync(join(hackRoot, 'src', 'env.d.ts'), join(crossingRoot, 'env.d.ts'), { force: true });
}

console.log('merge complete');
