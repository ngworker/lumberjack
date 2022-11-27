import { glob } from 'glob';

export type ListFilePathsFn = (pattern: string) => Promise<readonly string[]>;

export const listFilePaths: ListFilePathsFn = (pattern) => glob(pattern);
