import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const NEXUS_ROOT = path.resolve(__dirname, '..', '..');

export function resolveFromRoot(...parts) {
  return path.resolve(NEXUS_ROOT, ...parts);
}

export function expandWindowsEnv(input) {
  if (!input || typeof input !== 'string') return input;
  return input.replace(/%([^%]+)%/g, (_, name) => {
    const value = process.env[name] ?? process.env[name.toUpperCase()] ?? process.env[name.toLowerCase()];
    return value != null ? value : `%${name}%`;
  });
}
