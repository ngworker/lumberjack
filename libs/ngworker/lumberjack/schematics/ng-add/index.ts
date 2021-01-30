import { chain, Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

import { addImportToModule, insertImport } from '../utils/ast-utils';
import { InsertChange } from '../utils/change';
import { findModuleFromOptions } from '../utils/find-module';
import { buildDefaultPath, getWorkspace } from '../utils/workspace';

import { NgAddOptions } from './schema';

function addImportToNgModule(options: NgAddOptions): Rule {
  return (host: Tree) => {
    const modulePath = findModuleFromOptions(host, options);

    if (!modulePath) {
      return host;
    }

    if (!host.exists(modulePath)) {
      throw new Error('Specified module does not exist');
    }

    const text = host.read(modulePath);
    if (text === null) {
      throw new SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');

    const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);

    const importChanges = addImportToModule(
      source,
      modulePath,
      'LumberjackModule.forRoot()',
      '@ngworker/lumberjack'
    ).shift();

    const changes = [insertImport(source, modulePath, 'LumberjackModule', '@ngworker/lumberjack'), importChanges];

    if (options.consoleDriver) {
      const importConsoleChanges = addImportToModule(
        source,
        modulePath,
        'LumberjackConsoleDriverModule.forRoot()',
        '@ngworker/lumberjack/console-driver'
      ).shift();

      changes.push(
        insertImport(source, modulePath, 'LumberjackConsoleDriverModule', '@ngworker/lumberjack/console-driver'),
        importConsoleChanges
      );
    }

    if (options.httpDriver) {
      const importHttpChanges = addImportToModule(
        source,
        modulePath,
        `LumberjackHttpDriverModule.withOptions({
          origin: '${options.project}',
          storeUrl: '/api/logs',
          retryOptions: { maxRetries: 5, delayMs: 250 },
        })`,
        '@ngworker/lumberjack/http-driver'
      ).shift();

      changes.push(
        insertImport(source, modulePath, 'LumberjackHttpDriverModule ', '@ngworker/lumberjack/http-driver'),
        importHttpChanges
      );
    }

    const recorder = host.beginUpdate(modulePath);

    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);

    return host;
  };
}

// Just return the tree
export default function (options: NgAddOptions): Rule {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project as string);
    if (options.path === undefined && project) {
      options.path = buildDefaultPath(project);
    }

    return chain([addImportToNgModule(options)]);
  };
}
