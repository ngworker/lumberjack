import { configureSonarReportPaths } from './configure-sonar-report-paths';

export interface AppOptions {
  readonly lintReportKey: string;
  readonly lintReportPattern: string;
  readonly placeholder: string;
  readonly sonarFile: string;
  readonly testCoverageReportKey: string;
  readonly testCoverageReportPattern: string;
}

export function app({
  lintReportKey,
  lintReportPattern,
  placeholder,
  sonarFile,
  testCoverageReportKey,
  testCoverageReportPattern,
}: AppOptions): Promise<void> {
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
}
