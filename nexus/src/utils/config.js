import fs from 'node:fs';
import path from 'node:path';
import { resolveFromRoot } from './paths.js';

function deepMerge(base, override) {
  if (!override || typeof override !== 'object') return base;
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && base[key] && typeof base[key] === 'object') {
      out[key] = deepMerge(base[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export function loadConfig(overrides = {}) {
  const configPath = resolveFromRoot('config', 'default.json');
  let raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const profile = process.env.NEXUS_PROFILE;
  if (profile) {
    const profilePath = resolveFromRoot('config', `${profile}.json`);
    if (fs.existsSync(profilePath)) {
      raw = deepMerge(raw, JSON.parse(fs.readFileSync(profilePath, 'utf8')));
    }
  }

  const envOverrides = {
    host: process.env.NEXUS_HOST,
    port: process.env.NEXUS_PORT ? Number(process.env.NEXUS_PORT) : undefined,
    recoveryToken: process.env.NEXUS_RECOVERY_TOKEN,
    dataDir: process.env.NEXUS_DATA_DIR,
  };
  const cleaned = Object.fromEntries(Object.entries(envOverrides).filter(([, v]) => v !== undefined && v !== ''));
  const merged = deepMerge(deepMerge(raw, cleaned), overrides);

  merged.dataDir = path.isAbsolute(merged.dataDir)
    ? merged.dataDir
    : resolveFromRoot(merged.dataDir);

  if (merged.workspace?.defaultPath) {
    merged.workspace.defaultPath = path.isAbsolute(merged.workspace.defaultPath)
      ? merged.workspace.defaultPath
      : resolveFromRoot(merged.workspace.defaultPath);
  }

  return merged;
}
