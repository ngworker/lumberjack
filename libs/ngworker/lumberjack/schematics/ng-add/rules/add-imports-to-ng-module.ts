import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

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
