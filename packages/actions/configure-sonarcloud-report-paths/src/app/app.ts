import { ConfigureSonarReportPathsFn } from './configure-sonar-report-paths';

export interface AppDependencies {
  readonly configureSonarReportPaths: ConfigureSonarReportPathsFn;
}
export type AppFn = (options: AppOptions) => Promise<void>;
export interface AppOptions {
  readonly lintReportKey: string;
  readonly lintReportPattern: string;
  readonly placeholder: string;
  readonly sonarFile: string;
  readonly testCoverageReportKey: string;
  readonly testCoverageReportPattern: string;
}

export const createApp =
  ({ configureSonarReportPaths }: AppDependencies): AppFn =>
  ({
    lintReportKey,
    lintReportPattern,
    placeholder,
    sonarFile,
    testCoverageReportKey,
    testCoverageReportPattern,
  }: AppOptions) => {
    return Promise.all([
      configureSonarReportPaths({
        placeholder,
        reportPattern: lintReportPattern,
        sonarFile,
        sonarKey: lintReportKey,
      }),
      configureSonarReportPaths({
        placeholder,
        reportPattern: testCoverageReportPattern,
        sonarFile,
        sonarKey: testCoverageReportKey,
      }),
    ]).then(() => undefined);
  };
