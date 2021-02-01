import { Path } from '@angular-devkit/core';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { Change } from '@schematics/angular/utility/change';
import { SourceFile } from 'typescript';

import { NgAddOptions } from '../schema';

export function addConsoleDriverToNgModule({
  options,
  modulePath,
  source,
}: {
  readonly options: NgAddOptions;
  readonly source: SourceFile;
  readonly modulePath: Path;
}): Change[] {
  if (!options.consoleDriver) {
    return [];
  }

  return addImportToModule(
    source,
    modulePath,
    'LumberjackConsoleDriverModule.forRoot()',
    '@ngworker/lumberjack/console-driver'
  );
}
