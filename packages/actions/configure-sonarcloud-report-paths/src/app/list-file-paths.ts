import { glob } from 'glob';

export function listFilePaths(pattern): Promise<readonly string[]> {
  return glob(pattern);
}
