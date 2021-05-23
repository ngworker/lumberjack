import { deleteAppAdditions } from './delete-app-additions';
import { revertAppChanges } from './revert-app-changes';
import { revertConfigurationChanges } from './revert-configuration-changes';

/**
 * Call this as part of an `afterEach` test hook.
 */
export function tearDownTestCase(): void {
  revertConfigurationChanges();
  revertAppChanges();
  deleteAppAdditions();
}
