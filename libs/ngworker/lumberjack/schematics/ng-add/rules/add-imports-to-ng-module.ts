import * as ts from 'typescript';
import { Rule, Tree } from '@angular-devkit/schematics';

import { applyToUpdateRecorder } from '../../utils/change';
import { findModuleFromOptions } from '../../utils/find-module';
import { NgAddOptions } from '../schema';
import { addConsoleDriverToNgModule } from '../tasks/add-console-driver-to-ng-module';
import { addHttpDriverToNgModule } from '../tasks/add-http-driver-to-ng-module';
import { addLumberjackToNgModule } from '../tasks/add-lumberjack-to-ng-module';

export function addImportsToNgModule(options: NgAddOptions): Rule {
  return (host: Tree) => {
    const modulePath = findModuleFromOptions(host, options);

    if (!modulePath) {
      // import skipped
      return host;
    }

    const text = host.read(modulePath);

    if (!text) {
      throw new Error(`Cannot read "${modulePath}".`);
    }

    const sourceText = text.toString('utf-8');
    const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
    const changes = [
      ...addLumberjackToNgModule({ modulePath, source }),
      ...addConsoleDriverToNgModule({
        options,
        modulePath,
        source,
      }),
      ...addHttpDriverToNgModule({ options, modulePath, source }),
    ];
    const recorder = host.beginUpdate(modulePath);

    applyToUpdateRecorder(recorder, changes);
    host.commitUpdate(recorder);

    return host;
  };
}
