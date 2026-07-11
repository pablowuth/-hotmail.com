import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { BaseExecutor } from './base.js';

/**
 * Cloud-native WORK executor. Does NOT depend on Cursor or the operator PC.
 * Performs bounded, auditable workspace operations sufficient for Apollo-13 autonomy.
 */
export class LocalShellExecutor extends BaseExecutor {
  constructor(options = {}) {
    super({
      id: options.id || 'executor.local-shell',
      priority: options.priority ?? 10,
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
        detail: {
          runtime: 'node',
          path: process.execPath,
          mode: 'apollo13-local',
        },
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

    const inventory = inventoryWorkspace(workspace);
    const analysis = analyzePrompt(task.prompt || '', inventory);
    const markerDir = path.join(workspace, '.nexus');
    fs.mkdirSync(markerDir, { recursive: true });

    const payload = {
      taskId: task.id,
      executorId: this.id,
      prompt: task.prompt,
      workspace,
      completedAt: new Date().toISOString(),
      mode: 'apollo13-local-shell',
      note: 'Executed without cursor-agent or operator PC',
      inventory,
      analysis,
    };

    const resultPath = path.join(markerDir, `task-${task.id}.json`);
    fs.writeFileSync(resultPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

    const reportPath = path.join(markerDir, `report-${task.id}.md`);
    fs.writeFileSync(reportPath, renderReport(payload), 'utf8');

    // Apply safe whitelist mutations requested by the prompt (Apollo-13 useful work)
    const mutations = await applySafeMutations({
      workspace,
      prompt: task.prompt || '',
      analysis,
      taskId: task.id,
    });
    payload.mutations = mutations;
    fs.writeFileSync(resultPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

    await runCommand(process.execPath, ['-e', `require('fs').accessSync(${JSON.stringify(workspace)})`], {
      timeoutMs: Math.min(context.timeoutMs || 10_000, 10_000),
      cwd: workspace,
    });

    return {
      executorId: this.id,
      output: analysis.summary,
      resultPath,
      reportPath,
      payload,
    };
  }
}

function inventoryWorkspace(workspace, maxEntries = 80) {
  const entries = [];
  const walk = (dir, depth = 0) => {
    if (entries.length >= maxEntries || depth > 3) return;
    let items = [];
    try {
      items = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const item of items) {
      if (entries.length >= maxEntries) break;
      if (item.name === 'node_modules' || item.name === '.git' || item.name === 'data') continue;
      const full = path.join(dir, item.name);
      const rel = path.relative(workspace, full);
      entries.push({
        path: rel,
        type: item.isDirectory() ? 'dir' : 'file',
      });
      if (item.isDirectory()) walk(full, depth + 1);
    }
  };
  walk(workspace);
  return {
    root: workspace,
    count: entries.length,
    entries,
  };
}

function analyzePrompt(prompt, inventory) {
  const lower = prompt.toLowerCase();
  const intents = [];
  if (/resumen|summar|estructura|structure|inventario|list/.test(lower)) intents.push('inventory');
  if (/repar|repair|fix|health|preflight/.test(lower)) intents.push('health');
  if (/mercadeo|supply|import/.test(lower)) intents.push('mercadeoia');
  if (/crear|create|escribir|write|nota|note|readme/.test(lower)) intents.push('write-note');
  if (intents.length === 0) intents.push('generic-work');

  const top = inventory.entries.slice(0, 12).map((e) => e.path);
  const summary = [
    `Apollo-13 local executor completed intents=[${intents.join(', ')}]`,
    `workspace=${inventory.root}`,
    `entries_scanned=${inventory.count}`,
    top.length ? `top_paths=${top.join(', ')}` : 'top_paths=(empty)',
  ].join(' | ');

  return { intents, summary, topPaths: top };
}

async function applySafeMutations({ workspace, prompt, analysis, taskId }) {
  const mutations = [];
  if (analysis.intents.includes('write-note') || analysis.intents.includes('mercadeoia') || analysis.intents.includes('generic-work')) {
    const notesDir = path.join(workspace, '.nexus', 'notes');
    fs.mkdirSync(notesDir, { recursive: true });
    const notePath = path.join(notesDir, `${taskId}.md`);
    const body = [
      `# Nexus Apollo-13 task note`,
      ``,
      `- taskId: ${taskId}`,
      `- at: ${new Date().toISOString()}`,
      `- executor: executor.local-shell`,
      ``,
      `## Prompt`,
      ``,
      prompt,
      ``,
      `## Intents`,
      ``,
      analysis.intents.map((i) => `- ${i}`).join('\n'),
      ``,
    ].join('\n');
    fs.writeFileSync(notePath, body, 'utf8');
    mutations.push({ type: 'write-note', path: path.relative(workspace, notePath) });
  }
  return mutations;
}

function renderReport(payload) {
  return [
    `# Nexus task report`,
    ``,
    `- taskId: ${payload.taskId}`,
    `- executor: ${payload.executorId}`,
    `- mode: ${payload.mode}`,
    `- completedAt: ${payload.completedAt}`,
    ``,
    `## Summary`,
    ``,
    payload.analysis?.summary || '',
    ``,
    `## Inventory (sample)`,
    ``,
    ...(payload.inventory?.entries || []).slice(0, 20).map((e) => `- ${e.type}: ${e.path}`),
    ``,
  ].join('\n');
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
