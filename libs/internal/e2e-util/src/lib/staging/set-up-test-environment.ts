import { addPackage } from './add-package';
import { buildPackage } from './build-package';
import { deletePathAliases } from './delete-path-aliases';
import { isCiWorkflow } from './is-ci-workflow';
import { removePackage } from './remove-package';

/**
 * Call this as part of a `beforeAll` test hook.
 */
export async function setUpTestEnvironment(): Promise<void> {
  deletePathAliases();

  if (isCiWorkflow()) {
    return;
  }

  removePackage();
  buildPackage();
  await addPackage();
}
