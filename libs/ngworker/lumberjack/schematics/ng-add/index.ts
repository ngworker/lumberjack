import { chain, Rule, Tree } from '@angular-devkit/schematics';

import { buildDefaultPath, getWorkspace } from '../utils/workspace';

import { addImportsToNgModule } from './rules/add-imports-to-ng-module';
import { NgAddOptions } from './schema';

// Just return the tree
export default function (options: NgAddOptions): Rule {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project);

    if (options.path === undefined && project) {
      options.path = buildDefaultPath(project);
    }

    return chain([addImportsToNgModule(options)]);
  };
}
