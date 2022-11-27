import { configureSonar } from './configure-sonar';
import { listFilePaths } from './list-file-paths';

interface ConfigureSonarReportPathsOptions {
  readonly placeholder: string;
  readonly reportPattern: string;
  readonly sonarFile: string;
  readonly sonarKey: string;
}

export async function configureSonarReportPaths({
  placeholder,
  reportPattern,
  sonarFile,
  sonarKey,
}: ConfigureSonarReportPathsOptions): Promise<void> {
  const reportPaths = await listFilePaths(reportPattern);

  return configureSonar({
    file: sonarFile,
    key: sonarKey,
    placeholder,
    value: reportPaths.join(','),
  });
}
