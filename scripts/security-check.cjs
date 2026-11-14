// Static pre-deployment checks. Findings print file paths and categories, never values.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const argument = process.argv.find((value) => value.startsWith('--build-dir='));
const build = path.resolve(root, argument ? argument.slice('--build-dir='.length) : 'build');
const findings = [];
// Frontend environment variables become public JavaScript; report names, never values.
for (const name of Object.keys(process.env)) {
  if (/^REACT_APP_.*(?:KEY|TOKEN|SECRET|PASSWORD|PRIVATE)/i.test(name) && process.env[name]) findings.push([name, 'secret-like frontend environment variable']);
}
for (const entry of fs.readdirSync(root)) {
  if (!/^\.env(?:\.|$)/.test(entry) || entry.endsWith('.example') || !fs.statSync(path.join(root, entry)).isFile()) continue;
  const env = fs.readFileSync(path.join(root, entry), 'utf8');
  if (/^\s*REACT_APP_[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PRIVATE)[A-Z0-9_]*\s*=/im.test(env)) findings.push([entry, 'secret-like frontend environment variable']);
}
const credential = /(?:sk_vision_[A-Za-z0-9]{16,}|AKIA[A-Z0-9]{16}|ghp_[a-zA-Z0-9]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/;
function inspect(dir, isBuild = false) {
  if (!fs.existsSync(dir)) { findings.push([path.relative(root, dir), 'missing directory']); return; }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { inspect(file, isBuild); continue; }
    if (entry.isSymbolicLink()) { findings.push([path.relative(root, file), 'unexpected public symlink']); continue; }
    if (/\.(map|sql|log|bak|old|orig|save|zip|tar|7z|rar|php|phtml|phar)$/i.test(entry.name) || /^\.env(?:\.|$)/.test(entry.name)) findings.push([path.relative(root, file), 'sensitive artifact']);
    if (!/\.(js|jsx|json|html|txt|css)$/i.test(entry.name)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (credential.test(text)) findings.push([path.relative(root, file), 'possible embedded credential: rotate externally']);
    if (isBuild && /sourceMappingURL\s*=/.test(text)) findings.push([path.relative(root, file), 'source map reference']);
  }
}
inspect(path.join(root, 'src'));
inspect(path.join(root, 'public'));
inspect(build, true);
if (findings.length) {
  for (const [file, reason] of findings) console.error(`${file}: ${reason}`);
  process.exitCode = 1;
} else {
  console.log('Security artifact checks passed: no matched credentials, source maps or sensitive artifacts. This is not a complete vulnerability scan.');
}
