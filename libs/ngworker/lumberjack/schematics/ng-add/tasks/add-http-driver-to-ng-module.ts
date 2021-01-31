import { Path } from '@angular-devkit/core';
import { SourceFile } from 'typescript';

import { addImportToModule, insertImport } from '../../utils/ast-utils';
import { Change } from '../../utils/change';
import { NgAddOptions } from '../schema';

export function addHttpDriverToNgModule({
  options,
  modulePath,
  source,
}: {
  readonly options: NgAddOptions;
  readonly source: SourceFile;
  readonly modulePath: Path;
}): Change[] {
  if (!options.httpDriver) {
    return [];
  }

  return addImportToModule(
    source,
    modulePath,
    `LumberjackHttpDriverModule.withOptions({ origin: '${options.project}', storeUrl: '/api/logs', retryOptions: { maxRetries: 5, delayMs: 250 } })`,
    '@ngworker/lumberjack/http-driver'
  );
}
