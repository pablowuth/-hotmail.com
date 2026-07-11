import { startNexus } from './runtime.js';

const runtime = await startNexus();

async function shutdown(signal) {
  console.info(`[nexus] shutting down (${signal})`);
  try {
    const { stopNexus } = await import('./runtime.js');
    await stopNexus(runtime);
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
