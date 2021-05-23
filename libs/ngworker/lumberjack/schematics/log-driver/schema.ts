export interface LogDriverOptions {
  name: string;
  path?: string;
  project?: string;
  flat?: boolean;
  skipTests?: boolean;
  rootFolder?: string;
}
