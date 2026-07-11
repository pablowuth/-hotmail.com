import { BaseExecutor } from './base.js';
import {
  resolveCursorAgentLauncher,
  launchCursorAgent,
} from '../launcher/windows-cursor-agent.js';

export class CursorAgentExecutor extends BaseExecutor {
  constructor(options = {}) {
    super({
      id: options.id || 'executor.cursor-agent',
      priority: options.priority ?? 10,
      enabled: options.enabled !== false,
      healthTimeoutMs: options.healthTimeoutMs || 3000,
    });
    this.searchRoots = options.searchRoots || [];
    this._launcherCache = null;
    this._launcherCacheAt = 0;
    this.cacheTtlMs = options.cacheTtlMs || 10_000;
  }

  async resolveLauncher(force = false) {
    const now = Date.now();
    if (!force && this._launcherCache && now - this._launcherCacheAt < this.cacheTtlMs) {
      return this._launcherCache;
    }
    this._launcherCache = await resolveCursorAgentLauncher({
      searchRoots: this.searchRoots,
      probeTimeoutMs: this.healthTimeoutMs,
    });
    this._launcherCacheAt = now;
    return this._launcherCache;
  }

  async healthCheck() {
    const started = Date.now();
    try {
      const launcher = await this.resolveLauncher(true);
      const healthy = Boolean(launcher.ok);
      this.lastHealth = {
        ok: healthy,
        latencyMs: Date.now() - started,
        detail: healthy
          ? { kind: launcher.kind, path: launcher.resolvedPath }
          : { reason: launcher.reason, candidates: launcher.candidates?.length || 0 },
        checkedAt: new Date().toISOString(),
      };
      return this.lastHealth;
    } catch (err) {
      this.lastHealth = {
        ok: false,
        latencyMs: Date.now() - started,
        detail: { error: err.message },
        checkedAt: new Date().toISOString(),
      };
      return this.lastHealth;
    }
  }

  async execute(task, context = {}) {
    const launcher = await this.resolveLauncher();
    if (!launcher.ok) {
      const err = new Error(launcher.reason || 'cursor-agent unavailable');
      err.code = 'EXECUTOR_UNAVAILABLE';
      throw err;
    }

    const workspace = task.workspace || context.workspace || process.cwd();
    const prompt = task.prompt;
    const result = await launchCursorAgent({
      launcher,
      args: ['-p', '--force', '--workspace', workspace, prompt],
      cwd: workspace,
      timeoutMs: context.timeoutMs || 120_000,
    });

    if (result.code !== 0) {
      const err = new Error(`cursor-agent exited with code ${result.code}`);
      err.code = 'EXECUTOR_FAILED';
      err.stdout = result.stdout;
      err.stderr = result.stderr;
      throw err;
    }

    return {
      executorId: this.id,
      output: result.stdout || result.stderr || 'cursor-agent completed',
      raw: result,
    };
  }
}
