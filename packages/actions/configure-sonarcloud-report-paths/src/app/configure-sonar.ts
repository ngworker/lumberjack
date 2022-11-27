import { replaceTextInFile } from './replace-text-in-file';

export interface ConfigureSonarOptions {
  readonly file: string;
  readonly key: string;
  readonly placeholder: string;
  readonly value: string;
}

export function configureSonar({ file, key, placeholder, value }: ConfigureSonarOptions): Promise<void> {
  return replaceTextInFile({
    file,
    from: `${key}=${placeholder}`,
    to: `${key}=${value}`,
  });
}
