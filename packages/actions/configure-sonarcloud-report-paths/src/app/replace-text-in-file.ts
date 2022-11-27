import { replaceInFile } from 'replace-in-file';

export type ReplaceTextInFileFn = (options: ReplaceTextInFileOptions) => Promise<void>;
export interface ReplaceTextInFileOptions {
  readonly file: string;
  readonly from: string;
  readonly to: string;
}

export const replaceTextInFile: ReplaceTextInFileFn = async ({ file, from, to }) => {
  const replacementResults = await replaceInFile({
    files: file,
    from,
    to,
  });

  if (replacementResults.length === 0) {
    return Promise.reject(new Error(`The file with the path "${file}" was not found.`));
  }

  const [replacementResult] = replacementResults;

  if (replacementResult.hasChanged === false) {
    return Promise.reject(new Error(`Could not find "${from}" in the file "${file}".`));
  }
};
