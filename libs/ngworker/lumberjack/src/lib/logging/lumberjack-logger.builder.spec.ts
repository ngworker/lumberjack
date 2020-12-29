import { TestBed } from '@angular/core/testing';

import { createLog, FakeTimeService, resolveDependency } from '@internal/test-util';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogBuilder } from './lumberjack-log.builder';
import { LumberjackLoggerBuilder } from './lumberjack-logger.builder';
import { LumberjackService } from './lumberjack.service';

interface TestPayload extends LumberjackLogPayload {
  testProperty: string;
}

const lumberjackLogLevels: LumberjackLogLevel[] = [LumberjackLevel.Critical, LumberjackLevel.Error];

describe(LumberjackLoggerBuilder.name, () => {
  const testMessage = 'Test Message';

  let fakeTime: FakeTimeService;
  let lumberjackService: LumberjackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot()],
      providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
    });

    fakeTime = resolveDependency(LumberjackTimeService) as FakeTimeService;
    lumberjackService = (resolveDependency(LumberjackService) as unknown) as LumberjackService;
    spyOn(lumberjackService, 'log').and.stub();
  });

  describe('Base builder usage', () => {
    lumberjackLogLevels.forEach((level) =>
      it(`sends a ${level} level log`, () => {
        const builder = new LumberjackLoggerBuilder(lumberjackService, fakeTime, level, testMessage);
        const logFunction = builder.build();
        logFunction();
        const expectedLog: LumberjackLog = {
          message: testMessage,
          level,
          createdAt: fakeTime.getUnixEpochTicks(),
          payload: undefined,
          scope: undefined,
        };

        expect(lumberjackService.log).toHaveBeenCalledWith(expectedLog);
      })
    );
  });

  it('logs the specified scope', () => {
    const level = LumberjackLevel.Critical;
    const scope = 'Test Scope';
    const builder = new LumberjackLoggerBuilder(lumberjackService, fakeTime, level, testMessage);
    const logFunction = builder.withScope(scope).build();
    logFunction();
    const expectedLog = createLog(level, testMessage, scope);

    expect(lumberjackService.log).toHaveBeenCalledWith(expectedLog);
  });

  describe('LumberjackLogPayload', () => {
    const level = LumberjackLevel.Critical;
    const scope = 'Test Scope';
    const payload: TestPayload = {
      testProperty: 'TEST_PROPERTY',
    };
    let builder: LumberjackLoggerBuilder<TestPayload>;
    beforeEach(() => {
      builder = new LumberjackLoggerBuilder<TestPayload>(
        (lumberjackService as unknown) as LumberjackService<TestPayload>,
        fakeTime,
        level,
        testMessage
      );
    });

    it('logs the specified payload', () => {
      const logFunction = builder.withScope(scope).build();
      logFunction(payload);
      const expectedLog = createLog(level, testMessage, scope, payload);

      expect(((lumberjackService as unknown) as LumberjackService<TestPayload>).log).toHaveBeenCalledWith(expectedLog);
    });

    it('logs the specified static payload', () => {
      const logFunction = builder.withPayload(payload).build();
      logFunction();
      // const expectedLog = new LumberjackLogBuilder<TestPayload>(
      //   resolveDependency(LumberjackTimeService),
      //   level,
      //   testMessage
      // )
      //   .withScope('')
      //   .withPayload(payload) // 👈 Assertion doesn't accept the type produced
      //   .build();
      const expectedLog = new LumberjackLogBuilder<TestPayload>(
        resolveDependency(LumberjackTimeService),
        level,
        testMessage
      ).build(payload);

      expect(((lumberjackService as unknown) as LumberjackService<TestPayload>).log).toHaveBeenCalledWith(expectedLog);
    });

    it('logs the specified scope and payload', () => {
      const logFunction = builder.withScope(scope).withPayload(payload).build();
      logFunction();
      const expectedLog = createLog(level, testMessage, scope, payload);

      expect(((lumberjackService as unknown) as LumberjackService<TestPayload>).log).toHaveBeenCalledWith(expectedLog);
    });
  });
});
