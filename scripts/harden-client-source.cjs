// One-time mechanical migration: redact client logs and use configured resource origins.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) { walk(file); continue; }
    if (!/\.(js|jsx)$/.test(item.name) || file.endsWith('clientLogger.js') || /\.test\./.test(item.name)) continue;
    let text = fs.readFileSync(file, 'utf8');
    const before = text;
    const imports = [];
    const relative = (target) => {
      const value = path.relative(path.dirname(file), path.join(src, target)).replaceAll('\\', '/');
      return value.startsWith('.') ? value : './' + value;
    };
    if (/console\.(log|error|warn|debug|info)\s*\(/.test(text)) {
      text = text.replace(/console\.(log|error|warn|debug|info)\s*\(/g, 'clientLogger.$1(');
      if (!text.includes('import clientLogger from')) imports.push(`import clientLogger from '${relative('utils/clientLogger')}';`);
    }
    if (!file.endsWith(path.join('api', 'index.js'))) {
      const hadApiOrigin = /import\b[^;]*\bAPI_ORIGIN\b[^;]*from/.test(text);
      const withOrigins = text.replace(/(['"])http:\/\/127\.0\.0\.1:8000\1/g, 'API_ORIGIN')
        .replace(/`http:\/\/127\.0\.0\.1:8000\//g, `\`\${API_ORIGIN}/`);
      if (withOrigins !== text && !hadApiOrigin) imports.push(`import { API_ORIGIN } from '${relative('api')}';`);
      text = withOrigins;
    }
    if (text !== before) fs.writeFileSync(file, imports.join('\n') + (imports.length ? '\n' : '') + text);
  }
}
walk(src);
