import { createConfigureSonar } from './configure-sonar';
import { Log } from './log';
import { ReplaceTextInFileOptions } from './replace-text-in-file';

const identity = <TValue>(value: TValue): TValue => value;

describe('configureSonar', () => {
  function setup(
    {
      mockReplaceTextInFile = identity,
    }: {
      readonly mockReplaceTextInFile?: (
        mock: jest.Mock<Promise<void>, [ReplaceTextInFileOptions]>
      ) => jest.Mock<Promise<void>, [ReplaceTextInFileOptions]>;
    } = {
      mockReplaceTextInFile: identity,
    }
  ) {
    const logSpy: jest.Mocked<Log> = {
      debug: jest.fn<void, [string]>(),
      error: jest.fn<void, [string]>(),
      info: jest.fn<void, [string]>(),
      notice: jest.fn<void, [string]>(),
      warning: jest.fn<void, [string]>(),
    };
    const replaceTextInFileMock = mockReplaceTextInFile(jest.fn<Promise<void>, [ReplaceTextInFileOptions]>());
    const configureSonar = createConfigureSonar({
      log: logSpy,
      replaceTextInFile: replaceTextInFileMock,
    });

    return {
      configureSonar,
      logSpy,
      replaceTextInFileMock,
    };
  }

  it(`Given replaceTextInFile resolves
  Then "key", "placeholder", and "value" are combined and forwarded to "replaceTextInFile" with "file"`, async () => {
    const { configureSonar, replaceTextInFileMock } = setup();
    expect.assertions(2);

    await configureSonar({
      file: 'success-test-sonar-project.properties',
      key: 'success-test.sonar.key',
      placeholder: '<SUCCESS_TEST_PLACEHOLDER>',
      value: 'reports/apps/success-test-app/lint/report.json',
    });

    expect(replaceTextInFileMock).toHaveBeenCalledTimes(1);
    expect(replaceTextInFileMock).toHaveBeenCalledWith({
      file: 'success-test-sonar-project.properties',
      from: 'success-test.sonar.key=<SUCCESS_TEST_PLACEHOLDER>',
      to: 'success-test.sonar.key=reports/apps/success-test-app/lint/report.json',
    });
  });

  it(`Given replaceTextInFile resolves
  Then the configuration is logged`, async () => {
    const { configureSonar, logSpy } = setup();
    expect.assertions(2);

    await configureSonar({
      file: 'log-test-sonar-project.properties',
      key: 'log-test.sonar.key',
      placeholder: '<LOG_TEST_PLACEHOLDER>',
      value: 'reports/apps/log-test-app/lint/report.json',
    });

    expect(logSpy.info).toHaveBeenCalledTimes(1);
    expect(logSpy.info).toHaveBeenCalledWith('log-test.sonar.key=reports/apps/log-test-app/lint/report.json');
  });

  it(`Given "replaceTextInFile" rejects
  Then the promise rejects`, () => {
    const { configureSonar } = setup({
      mockReplaceTextInFile: (mock) => mock.mockRejectedValueOnce(new Error('Rejected by replaceTextInFile')),
    });
    expect.assertions(1);

    return expect(
      configureSonar({
        file: 'reject-test-sonar-project.properties',
        key: 'reject-test.sonar.key',
        placeholder: '<REJECT_TEST_PLACEHOLDER>',
        value: 'reports/apps/reject-test-app/lint/report.json',
      })
    ).rejects.toThrowError('Rejected by replaceTextInFile');
  });
});
