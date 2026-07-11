import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { expandWindowsEnv } from '../utils/paths.js';

/**
 * Dynamically resolve a usable Cursor Agent installation on Windows.
 * Never hardcode a versioned node.exe path.
 *
 * Order:
 * 1) agent.cmd via shell:true
 * 2) agent / cursor-agent on PATH
 * 3) versioned installs that actually contain node.exe + index.js
 */
export async function resolveCursorAgentLauncher(options = {}) {
  const platform = options.platform || process.platform;
  const env = options.env || process.env;
  const searchRoots = (options.searchRoots || []).map(expandWindowsEnv);
  const whichFn = options.whichFn || whichCommand;
  const existsFn = options.existsFn || ((p) => fs.existsSync(p));
  const readdirFn = options.readdirFn || ((p) => fs.readdirSync(p, { withFileTypes: true }));
  const probeFn = options.probeFn || probeCommand;

  const disabled = String(env.NEXUS_DISABLE_CURSOR_AGENT || '').toLowerCase();
  if (disabled === '1' || disabled === 'true' || disabled === 'yes') {
    return {
      ok: false,
      reason: 'cursor-agent disabled via NEXUS_DISABLE_CURSOR_AGENT',
      candidates: [],
    };
  }

  const candidates = [];

  // 1) Prefer agent.cmd with shell:true (Windows launcher)
  if (platform === 'win32') {
    const agentCmd = await whichFn('agent.cmd', env);
    if (agentCmd) {
      const probe = await probeFn({
        command: agentCmd,
        args: ['--version'],
        shell: true,
        env,
        timeoutMs: options.probeTimeoutMs || 4000,
      });
      candidates.push({ kind: 'agent.cmd', path: agentCmd, shell: true, probe });
      if (probe.ok) {
        return {
          ok: true,
          kind: 'agent.cmd',
          command: agentCmd,
          argsPrefix: [],
          shell: true,
          resolvedPath: agentCmd,
          candidates,
        };
      }
    }
  }

  // 2) PATH binaries
  for (const name of platform === 'win32' ? ['agent', 'cursor-agent', 'agent.cmd'] : ['agent', 'cursor-agent']) {
    const found = await whichFn(name, env);
    if (!found) continue;
    const useShell = platform === 'win32' && name.endsWith('.cmd');
    const probe = await probeFn({
      command: found,
      args: ['--version'],
      shell: useShell,
      env,
      timeoutMs: options.probeTimeoutMs || 4000,
    });
    candidates.push({ kind: 'path', path: found, shell: useShell, probe });
    if (probe.ok) {
      return {
        ok: true,
        kind: 'path',
        command: found,
        argsPrefix: [],
        shell: useShell,
        resolvedPath: found,
        candidates,
      };
    }
  }

  // 3) Versioned installs with real node.exe + index.js
  const roots = searchRoots.length
    ? searchRoots
    : defaultSearchRoots(platform, env);

  for (const root of roots) {
    if (!root || !existsFn(root)) continue;
    const versionsDir = path.join(root, 'versions');
    const scanDirs = [];
    if (existsFn(versionsDir)) {
      try {
        const entries = readdirFn(versionsDir)
          .filter((d) => d.isDirectory())
          .map((d) => d.name)
          .sort()
          .reverse();
        for (const name of entries) scanDirs.push(path.join(versionsDir, name));
      } catch {
        // ignore unreadable versions dir
      }
    }
    scanDirs.push(root);

    for (const dir of scanDirs) {
      const nodeExe = platform === 'win32'
        ? path.join(dir, 'node.exe')
        : path.join(dir, 'node');
      const indexJs = path.join(dir, 'index.js');
      const hasNode = existsFn(nodeExe);
      const hasIndex = existsFn(indexJs);
      candidates.push({
        kind: 'versioned',
        path: dir,
        nodeExe,
        indexJs,
        hasNode,
        hasIndex,
      });
      if (!hasNode || !hasIndex) continue;

      const probe = await probeFn({
        command: nodeExe,
        args: [indexJs, '--version'],
        shell: false,
        env,
        timeoutMs: options.probeTimeoutMs || 4000,
      });
      candidates[candidates.length - 1].probe = probe;
      if (probe.ok) {
        return {
          ok: true,
          kind: 'versioned',
          command: nodeExe,
          argsPrefix: [indexJs],
          shell: false,
          resolvedPath: dir,
          candidates,
        };
      }
    }
  }

  return {
    ok: false,
    reason: 'No valid cursor-agent installation found',
    candidates,
  };
}

function defaultSearchRoots(platform, env) {
  if (platform !== 'win32') {
    const home = env.HOME || env.USERPROFILE || '';
    return [
      path.join(home, '.local', 'share', 'cursor-agent'),
      path.join(home, '.cursor-agent'),
      '/usr/lib/cursor-agent',
    ];
  }
  const local = env.LOCALAPPDATA || path.join(env.USERPROFILE || '', 'AppData', 'Local');
  const user = env.USERPROFILE || '';
  return [
    path.join(local, 'cursor-agent'),
    path.join(local, 'Programs', 'cursor-agent'),
    path.join(user, '.cursor-agent'),
  ];
}

export function whichCommand(command, env = process.env) {
  return new Promise((resolve) => {
    const isWin = process.platform === 'win32';
    const cmd = isWin ? 'where' : 'which';
    const child = spawn(cmd, [command], {
      env,
      shell: isWin,
      windowsHide: true,
    });
    let stdout = '';
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.on('error', () => resolve(null));
    child.on('close', (code) => {
      if (code !== 0) return resolve(null);
      const first = stdout.split(/\r?\n/).map((l) => l.trim()).find(Boolean);
      resolve(first || null);
    });
  });
}

export function probeCommand({ command, args = [], shell = false, env = process.env, timeoutMs = 4000 }) {
  return new Promise((resolve) => {
    let settled = false;
    const child = spawn(command, args, {
      env,
      shell,
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { child.kill('SIGKILL'); } catch { /* ignore */ }
      resolve({ ok: false, error: `probe timeout after ${timeoutMs}ms`, stdout, stderr });
    }, timeoutMs);

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ok: false, error: err.message, stdout, stderr });
    });
    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        ok: code === 0,
        code,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        error: code === 0 ? null : `exit ${code}`,
      });
    });
  });
}

export async function launchCursorAgent({ launcher, args, cwd, env = process.env, timeoutMs = 60000 }) {
  if (!launcher?.ok) {
    throw new Error(launcher?.reason || 'cursor-agent launcher unavailable');
  }
  const finalArgs = [...(launcher.argsPrefix || []), ...args];
  return new Promise((resolve, reject) => {
    let settled = false;
    const child = spawn(launcher.command, finalArgs, {
      cwd,
      env,
      shell: Boolean(launcher.shell),
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { child.kill('SIGKILL'); } catch { /* ignore */ }
      reject(new Error(`cursor-agent timed out after ${timeoutMs}ms`));
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
      resolve({ code, stdout, stderr });
    });
  });
}
