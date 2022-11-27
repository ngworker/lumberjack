import { ConfigureSonarFn } from './configure-sonar';
import { ListFilePathsFn } from './list-file-paths';

export interface ConfigureSonarReportPathsDependencies {
  readonly listFilePaths: ListFilePathsFn;
  readonly configureSonar: ConfigureSonarFn;
}
export type ConfigureSonarReportPathsFn = (options: ConfigureSonarReportPathsOptions) => Promise<void>;
export interface ConfigureSonarReportPathsOptions {
  readonly placeholder: string;
  readonly reportPattern: string;
  readonly sonarFile: string;
  readonly sonarKey: string;
}

export const createConfigureSonarReportPaths =
  ({ configureSonar, listFilePaths }: ConfigureSonarReportPathsDependencies): ConfigureSonarReportPathsFn =>
  ({ placeholder, reportPattern, sonarFile, sonarKey }: ConfigureSonarReportPathsOptions) =>
    listFilePaths(reportPattern).then((reportPaths) =>
      configureSonar({
        file: sonarFile,
        key: sonarKey,
        placeholder,
        value: reportPaths.join(','),
      })
    );
