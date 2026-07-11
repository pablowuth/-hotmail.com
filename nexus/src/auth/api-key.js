export function resolveApiKey(config) {
  return process.env.NEXUS_API_KEY || config.auth?.apiKey || null;
}

export function isAuthRequired(config) {
  if (process.env.NEXUS_AUTH_REQUIRED === '0') return false;
  if (process.env.NEXUS_AUTH_REQUIRED === '1') return true;
  if (config.auth?.required === true) return true;
  return Boolean(resolveApiKey(config));
}

export function extractApiKey(req) {
  const header = req.headers.authorization || req.headers['x-nexus-api-key'];
  if (!header || typeof header !== 'string') return null;
  if (header.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim();
  }
  return header.trim();
}

export function assertApiKey(req, config) {
  if (!isAuthRequired(config)) return;

  const expected = resolveApiKey(config);
  if (!expected) {
    const err = new Error('API key not configured');
    err.code = 'AUTH_MISCONFIGURED';
    err.status = 500;
    throw err;
  }

  const provided = extractApiKey(req);
  if (!provided || provided !== expected) {
    const err = new Error('Invalid or missing API key');
    err.code = 'UNAUTHORIZED';
    err.status = 401;
    throw err;
  }
}
