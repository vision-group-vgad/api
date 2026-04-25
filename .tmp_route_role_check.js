const fs = require('fs');

function uniq(arr){return [...new Set(arr)];}

const appJs = fs.readFileSync('app.js','utf8');
const rolesJs = fs.readFileSync('src/auth/roles.js','utf8');

const mountRegex = /app\.use\(\s*(["'`])([^"'`]+)\1\s*,/g;
const mounts = [];
let m;
while ((m = mountRegex.exec(appJs)) !== null) {
  if (m[2].startsWith('/api/v1/')) mounts.push(m[2]);
}

const roleRegex = /(["'`])((?:\\.|(?!\1).)*)\1/g;
const rolePatterns = [];
while ((m = roleRegex.exec(rolesJs)) !== null) {
  const s = m[2];
  if (s.startsWith('/api/v1/') || s === '*') rolePatterns.push(s);
}

function canAccessLike(path, pattern){
  if (pattern === '*') return true;
  if (path === pattern) return true;
  if (pattern.endsWith('/*')) {
    const prefix = pattern.slice(0, -2);
    return path === prefix || path.startsWith(prefix + '/');
  }
  return false;
}

const uniqMounts = uniq(mounts).sort();
const uniqPatterns = uniq(rolePatterns).sort();

const uncovered = [];
let coveredCount = 0;
for (const p of uniqMounts) {
  const covered = uniqPatterns.some(r => canAccessLike(p, r));
  if (covered) coveredCount++; else uncovered.push(p);
}

console.log('total_mount_paths=' + uniqMounts.length);
console.log('covered_mount_paths=' + coveredCount);
console.log('uncovered_mount_paths=' + uncovered.length);
if (uncovered.length) {
  console.log('uncovered_list=' + JSON.stringify(uncovered));
}
