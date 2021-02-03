import { Path } from '@angular-devkit/core';
import { SourceFile } from 'typescript';

import { addImportToModule } from '../../utils/ast-utils';
import { Change } from '../../utils/change';
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
