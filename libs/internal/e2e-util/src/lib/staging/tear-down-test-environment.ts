import { isCiWorkflow } from './is-ci-workflow';
import { removePackage } from './remove-package';

/**
 * Call this as part of an `afterAll` test hook.
 */
export function tearDownTestEnvironment(): void {
  if (isCiWorkflow()) {
    return;
  }

  removePackage();
}
