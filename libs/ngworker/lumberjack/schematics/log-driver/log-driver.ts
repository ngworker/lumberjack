/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  Tree,
  url,
} from '@angular-devkit/schematics';

import { parseName } from '../utils/parse-name';
import { createDefaultPath } from '../utils/workspace';

import { LogDriverOptions } from './schema';

export function logDriver(options: LogDriverOptions): Rule {
  return async (host: Tree) => {
    if (!options.flat) {
      options.rootFolder = `${options.name}-driver`;
    }
    if (options.path === undefined) {
      options.path = await createDefaultPath(host, options.project as string);
    }

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const templateSource = apply(url('./files'), [
      options.skipTests ? filter((path) => !path.endsWith('.spec.ts.template')) : noop(),
      applyTemplates({
        ...strings,
        'if-flat': (s: string) => (options.flat ? '' : s),
        ...options,
      }),
      move(parsedPath.path),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
