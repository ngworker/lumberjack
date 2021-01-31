import { Path } from '@angular-devkit/core';
import { SourceFile } from 'typescript';

import { addImportToModule, insertImport } from '../../utils/ast-utils';
import { Change } from '../../utils/change';

export function addLumberjackToNgModule({
  modulePath,
  source,
}: {
  readonly source: SourceFile;
  readonly modulePath: Path;
}): Change[] {
  return [
    insertImport(source, modulePath, 'LumberjackModule', '@ngworker/lumberjack'),
    ...addImportToModule(source, modulePath, 'LumberjackModule.forRoot()', '@ngworker/lumberjack'),
  ];
}
