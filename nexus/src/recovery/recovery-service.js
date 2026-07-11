import { BOOTSTRAP_ACTIONS } from '../executors/bootstrap.js';

export class RecoveryService {
  constructor({ bootstrap, recoveryToken }) {
    this.bootstrap = bootstrap;
    this.recoveryToken = recoveryToken;
  }

  assertToken(provided) {
    if (!this.recoveryToken) {
      const err = new Error('Recovery token not configured');
      err.code = 'RECOVERY_MISCONFIGURED';
      err.status = 500;
      throw err;
    }
    if (!provided || provided !== this.recoveryToken) {
      const err = new Error('Invalid recovery token');
      err.code = 'UNAUTHORIZED';
      err.status = 401;
      throw err;
    }
  }

  allowedActions() {
    return [...BOOTSTRAP_ACTIONS];
  }

  async execute(action, params = {}) {
    if (!BOOTSTRAP_ACTIONS.includes(action)) {
      const err = new Error(`Action not allowed: ${action}`);
      err.code = 'INVALID_ACTION';
      err.status = 400;
      throw err;
    }
    return this.bootstrap.runAction(action, params);
  }
}
