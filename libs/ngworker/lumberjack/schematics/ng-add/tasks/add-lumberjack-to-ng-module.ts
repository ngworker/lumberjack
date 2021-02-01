import { Path } from '@angular-devkit/core';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import { Change } from '@schematics/angular/utility/change';
import { SourceFile } from 'typescript';

export function addLumberjackToNgModule({
  modulePath,
  source,
}: {
  readonly source: SourceFile;
  readonly modulePath: Path;
}): Change[] {
  return addImportToModule(source, modulePath, 'LumberjackModule.forRoot()', '@ngworker/lumberjack');
}
