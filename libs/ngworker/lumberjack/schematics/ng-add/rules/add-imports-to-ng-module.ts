import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

import { addImportToModule, insertImport } from '../../utils/ast-utils';
import { InsertChange } from '../../utils/change';
import { findModuleFromOptions } from '../../utils/find-module';
import { NgAddOptions } from '../schema';

export function addImportsToNgModule(options: NgAddOptions): Rule {
  return (host: Tree) => {
    const modulePath = findModuleFromOptions(host, options);

    if (!modulePath) {
      return host;
    }

    if (!host.exists(modulePath)) {
      throw new SchematicsException('The specified module does not exist.');
    }

    const text = host.read(modulePath);

    if (text === null) {
      throw new SchematicsException(`The file "${modulePath}" does not exist.`);
    }

    const sourceText = text.toString('utf-8');
    const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
    const [importChanges] = addImportToModule(source, modulePath, 'LumberjackModule.forRoot()', '@ngworker/lumberjack');

    let changes = [insertImport(source, modulePath, 'LumberjackModule', '@ngworker/lumberjack'), importChanges];

    if (options.consoleDriver) {
      const [importConsoleChanges] = addImportToModule(
        source,
        modulePath,
        'LumberjackConsoleDriverModule.forRoot()',
        '@ngworker/lumberjack/console-driver'
      );

      changes = [
        ...changes,
        insertImport(source, modulePath, 'LumberjackConsoleDriverModule', '@ngworker/lumberjack/console-driver'),
        importConsoleChanges,
      ];
    }

    if (options.httpDriver) {
      const [importHttpChanges] = addImportToModule(
        source,
        modulePath,
        `LumberjackHttpDriverModule.withOptions({
          origin: '${options.project}',
          storeUrl: '/api/logs',
          retryOptions: { maxRetries: 5, delayMs: 250 },
        })`,
        '@ngworker/lumberjack/http-driver'
      );

      changes = [
        ...changes,
        insertImport(source, modulePath, 'LumberjackHttpDriverModule ', '@ngworker/lumberjack/http-driver'),
        importHttpChanges,
      ];
    }

    const recorder = host.beginUpdate(modulePath);

    changes
      .filter((change) => change instanceof InsertChange)
      .map((change) => change as InsertChange)
      .forEach((change) => recorder.insertLeft(change.pos, change.toAdd));

    host.commitUpdate(recorder);

    return host;
  };
}
