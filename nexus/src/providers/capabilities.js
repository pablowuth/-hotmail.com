/** Canonical capability registry (skills-first contract). */
export const CORE_CAPABILITIES = Object.freeze([
  'repo.read',
  'repo.edit',
  'shell.run',
  'workspace.mount',
]);

export const RECOVERY_CAPABILITIES = Object.freeze([
  'recovery.repair',
  'recovery.reclaim',
  'recovery.export',
  'recovery.rollback',
]);

export const EXECUTOR_CAPABILITIES = Object.freeze({
  'executor.cursor-agent': ['repo.read', 'repo.edit', 'shell.run', 'workspace.mount'],
  'executor.local-shell': ['repo.read', 'repo.edit', 'shell.run', 'workspace.mount'],
  'executor.bootstrap': [...RECOVERY_CAPABILITIES],
});

export function capabilitiesForExecutor(executorId) {
  return EXECUTOR_CAPABILITIES[executorId] || ['shell.run'];
}

export function listCapabilityCatalog() {
  const all = new Set([...CORE_CAPABILITIES, ...RECOVERY_CAPABILITIES]);
  return [...all].map((id) => ({
    id,
    recoveryOnly: id.startsWith('recovery.'),
    core: CORE_CAPABILITIES.includes(id),
  }));
}
