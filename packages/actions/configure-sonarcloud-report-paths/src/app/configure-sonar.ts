import { ReplaceTextInFileFn } from './replace-text-in-file';

export interface ConfigureSonarDependencies {
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
  ({ replaceTextInFile }: ConfigureSonarDependencies): ConfigureSonarFn =>
  ({ file, key, placeholder, value }: ConfigureSonarOptions) =>
    replaceTextInFile({
      file,
      from: `${key}=${placeholder}`,
      to: `${key}=${value}`,
    });
