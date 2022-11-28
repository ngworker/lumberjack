import { Log } from './log';
import { ReplaceTextInFileFn } from './replace-text-in-file';

export interface ConfigureSonarDependencies {
  readonly log: Log;
  readonly replaceTextInFile: ReplaceTextInFileFn;
}
export type ConfigureSonarFn = (options: ConfigureSonarOptions) => Promise<void>;
export interface ConfigureSonarOptions {
  readonly file: string;
  readonly key: string;
  readonly placeholder: string;
  readonly value: string;
}

export const createConfigureSonar =
  ({ log, replaceTextInFile }: ConfigureSonarDependencies): ConfigureSonarFn =>
  ({ file, key, placeholder, value }: ConfigureSonarOptions) => {
    const to = `${key}=${value}`;

    log.info(to);

    return replaceTextInFile({
      file,
      from: `${key}=${placeholder}`,
      to,
    });
  };
