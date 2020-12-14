import { TestBed } from '@angular/core/testing';

import { resolveDependency } from '@internal/test-util';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLog } from '../logs/lumberjack.log';
import { Payload } from '../logs/payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLoggerBuilder } from './lumberjack-logger.builder';
import { LumberjackService } from './lumberjack.service';

interface TestPayload extends Payload {
  testProperty: string;
}

const lumberjackLogLevels: LumberjackLogLevel[] = [LumberjackLevel.Critical, LumberjackLevel.Error];

describe(LumberjackLoggerBuilder.name, () => {
  const testMessage = 'Test Message';
  const fakeDate = new Date('2020-02-02T02:02:02.000Z');

  let fakeTime: LumberjackTimeService;
  let lumberjackService: LumberjackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot()],
    });

    fakeTime = resolveDependency(LumberjackTimeService);
    lumberjackService = (resolveDependency(LumberjackService) as unknown) as LumberjackService;
    spyOn(lumberjackService, 'log').and.callFake(() => {});
    spyOn(fakeTime, 'getUnixEpochTicks').and.returnValue(fakeDate.valueOf());
  });

  describe('Base builder usage', () => {
    lumberjackLogLevels.forEach((level) =>
      it(`should send a LumberjackLog with message "${testMessage}" and level ${level}`, () => {
        const builder = new LumberjackLoggerBuilder(lumberjackService, fakeTime, level, testMessage);
        const logFunction = builder.build();
        logFunction();
        const expectedLog: LumberjackLog = {
          message: testMessage,
          level,
          createdAt: fakeDate.valueOf(),
          payload: undefined,
          scope: '',
        };

        expect(lumberjackService.log).toHaveBeenCalledWith(expectedLog);
      })
    );
  });

  it('should send the scope when specified', () => {
    const level = LumberjackLevel.Critical;
    const scope = 'Test Scope';
    const builder = new LumberjackLoggerBuilder(lumberjackService, fakeTime, level, testMessage);
    const logFunction = builder.withScope(scope).build();
    logFunction();
    const expectedLog: LumberjackLog = {
      message: testMessage,
      level,
      createdAt: fakeDate.valueOf(),
      payload: undefined,
      scope,
    };

    expect(lumberjackService.log).toHaveBeenCalledWith(expectedLog);
  });

  describe('Payload', () => {
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

    it('should send the payload when specified in the log function', () => {
      const logFunction = builder.withScope(scope).build();
      logFunction(payload);
      const expectedLog: LumberjackLog<TestPayload> = {
        message: testMessage,
        level,
        createdAt: fakeDate.valueOf(),
        payload,
        scope,
      };

      expect(((lumberjackService as unknown) as LumberjackService<TestPayload>).log).toHaveBeenCalledWith(expectedLog);
    });

    it('should send the payload when specified in withPayload builder function', () => {
      const logFunction = builder.withPayload(payload).build();
      logFunction();
      const expectedLog: LumberjackLog<TestPayload> = {
        message: testMessage,
        level,
        createdAt: fakeDate.valueOf(),
        payload,
        scope: '',
      };

      expect(((lumberjackService as unknown) as LumberjackService<TestPayload>).log).toHaveBeenCalledWith(expectedLog);
    });

    it('should send the scope and payload when both are specified', () => {
      const logFunction = builder.withScope(scope).withPayload(payload).build();
      logFunction();
      const expectedLog: LumberjackLog<TestPayload> = {
        message: testMessage,
        level,
        createdAt: fakeDate.valueOf(),
        payload,
        scope,
      };

      expect(((lumberjackService as unknown) as LumberjackService<TestPayload>).log).toHaveBeenCalledWith(expectedLog);
    });
  });
});
