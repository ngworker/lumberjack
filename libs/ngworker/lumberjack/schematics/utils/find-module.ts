/* tslint:disable */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { join, normalize, Path, strings } from '@angular-devkit/core';
import { DirEntry, Tree } from '@angular-devkit/schematics';

export interface ModuleOptions {
  module?: string;
  name: string;
  flat?: boolean;
  path?: string;
  skipImport?: boolean;
}

/**
 * Find the module referred by a set of options passed to the schematics.
 */
export function findModuleFromOptions(host: Tree, options: ModuleOptions): Path | undefined {
  if (options.hasOwnProperty('skipImport') && options.skipImport) {
    return undefined;
  }
  if (!options.module) {
    const pathToCheck = (options.path || '') + (options.flat ? '' : '/' + strings.dasherize(options.name));
    return normalize(findModule(host, pathToCheck));
  } else {
    const modulePath = normalize('/' + options.path + '/' + options.module);
    const moduleBaseName = normalize(modulePath).split('/').pop();
    if (host.exists(modulePath)) {
      return normalize(modulePath);
    } else if (host.exists(modulePath + '.ts')) {
      return normalize(modulePath + '.ts');
    } else if (host.exists(modulePath + '.module.ts')) {
      return normalize(modulePath + '.module.ts');
    } else if (host.exists(modulePath + '/' + moduleBaseName + '.module.ts')) {
      return normalize(modulePath + '/' + moduleBaseName + '.module.ts');
    } else {
      throw new Error(`Specified module path ${modulePath} does not exist`);
    }
  }
}

/**
 * Function to find the "closest" module to a generated file's path.
 */
export function findModule(host: Tree, generateDir: string): Path {
  let dir: DirEntry | null = host.getDir('/' + generateDir);

  const moduleRe = /\.module\.ts$/;
  const routingModuleRe = /-routing\.module\.ts/;

  while (dir) {
    const matches = dir.subfiles.filter((p) => moduleRe.test(p) && !routingModuleRe.test(p));

    if (matches.length === 1) {
      return join(dir.path, matches[0]);
    } else if (matches.length > 1) {
      throw new Error(
        'More than one module matches. Use skip-import option to skip importing ' +
          'the component into the closest module.'
      );
    }

    dir = dir.parent;
  }

  throw new Error('Could not find an NgModule. Use the skip-import ' + 'option to skip importing in NgModule.');
}
