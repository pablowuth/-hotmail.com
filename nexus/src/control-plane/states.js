export const TaskStatus = Object.freeze({
  QUEUED: 'QUEUED',
  WAITING_EXECUTOR: 'WAITING_EXECUTOR',
  RUNNING: 'RUNNING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
});

export const TERMINAL_STATUSES = new Set([
  TaskStatus.SUCCEEDED,
  TaskStatus.FAILED,
  TaskStatus.CANCELLED,
]);

export function isTerminal(status) {
  return TERMINAL_STATUSES.has(status);
}
