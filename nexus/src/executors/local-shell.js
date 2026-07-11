import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { BaseExecutor } from './base.js';

/**
 * Fallback executor that does not depend on Cursor.
 * Executes a bounded local "agent-like" work simulation / shell-safe echo of the task
 * and writes a nexus-result marker into the workspace when possible.
 */
export class LocalShellExecutor extends BaseExecutor {
  constructor(options = {}) {
    super({
      id: options.id || 'executor.local-shell',
      priority: options.priority ?? 50,
      enabled: options.enabled !== false,
      healthTimeoutMs: options.healthTimeoutMs || 1000,
    });
  }

  async healthCheck() {
    const started = Date.now();
    try {
      await runCommand(process.execPath, ['-e', 'process.exit(0)'], {
        timeoutMs: this.healthTimeoutMs,
      });
      this.lastHealth = {
        ok: true,
        latencyMs: Date.now() - started,
        detail: { runtime: 'node', path: process.execPath },
        checkedAt: new Date().toISOString(),
      };
    } catch (err) {
      this.lastHealth = {
        ok: false,
        latencyMs: Date.now() - started,
        detail: { error: err.message },
        checkedAt: new Date().toISOString(),
      };
    }
    return this.lastHealth;
  }

  async execute(task, context = {}) {
    const workspace = task.workspace || context.workspace || process.cwd();
    if (!fs.existsSync(workspace)) {
      const err = new Error(`Workspace does not exist: ${workspace}`);
      err.code = 'WORKSPACE_MISSING';
      throw err;
    }

    const markerDir = path.join(workspace, '.nexus');
    fs.mkdirSync(markerDir, { recursive: true });
    const resultPath = path.join(markerDir, `task-${task.id}.json`);
    const payload = {
      taskId: task.id,
      executorId: this.id,
      prompt: task.prompt,
      workspace,
      completedAt: new Date().toISOString(),
      mode: 'local-shell-fallback',
      note: 'Executed without cursor-agent (failover path)',
    };
    fs.writeFileSync(resultPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

    // Lightweight verification that the workspace is writable/usable
    await runCommand(process.execPath, ['-e', `require('fs').accessSync(${JSON.stringify(workspace)})`], {
      timeoutMs: context.timeoutMs || 10_000,
      cwd: workspace,
    });

    return {
      executorId: this.id,
      output: `Local fallback completed for task ${task.id}`,
      resultPath,
      payload,
    };
  }
}

function runCommand(command, args, { timeoutMs = 5000, cwd, env = process.env } = {}) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const child = spawn(command, args, { cwd, env, windowsHide: true });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { child.kill('SIGKILL'); } catch { /* ignore */ }
      reject(new Error(`command timeout after ${timeoutMs}ms`));
    }, timeoutMs);
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code !== 0) {
        const err = new Error(`exit ${code}: ${stderr || stdout}`);
        err.code = code;
        reject(err);
        return;
      }
      resolve({ stdout, stderr, code });
    });
  });
}
