import { TestBed } from '@angular/core/testing';

import { FakeTimeService, resolveDependency } from '@internal/test-util';

import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogFactory } from './lumberjack-log-factory';
import { LumberjackLogBuilder } from './lumberjack-log.builder';

describe(LumberjackLogFactory.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
    });

    fakeTime = resolveDependency(LumberjackTimeService) as FakeTimeService;
    logFactory = resolveDependency(LumberjackLogFactory);
  });

  const testMessage = 'Test message';
  let fakeTime: FakeTimeService;
  let logFactory: LumberjackLogFactory;

  describe('Log levels', () => {
    it('creates a critical log', () => {
      const log = logFactory.createCriticalLog(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Critical);
    });

    it('creates a debug log', () => {
      const log = logFactory.createDebugLog(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Debug);
    });

    it('creates a error log', () => {
      const log = logFactory.createErrorLog(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Error);
    });

    it('creates a info log', () => {
      const log = logFactory.createInfoLog(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Info);
    });

    it('creates a trace log', () => {
      const log = logFactory.createTraceLog(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Trace);
    });

    it('creates a warning log', () => {
      const log = logFactory.createWarningLog(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Warning);
    });
  });

  describe('Scope', () => {
    it('creates a log with a scope', () => {
      const testScope = 'Test scope';
      const log = logFactory.createCriticalLog(testMessage).withScope(testScope).build();

      expect(log.scope).toBe(testScope);
    });

    it('creates a log without a scope', () => {
      const log = logFactory.createDebugLog(testMessage).build();

      expect(log.scope).toBeUndefined();
    });
  });

  describe('Payload', () => {
    interface TestPayload extends LumberjackLogPayload {
      readonly test: boolean;
    }

    beforeEach(() => {
      logFactoryWithPayload = resolveDependency(LumberjackLogFactory);
    });

    let logFactoryWithPayload: LumberjackLogFactory<TestPayload>;

    it('creates a log with a static payload', () => {
      const log = logFactoryWithPayload.createErrorLog(testMessage).withPayload({ test: true }).build();

      expect(log.payload?.test).toBeTruthy();
    });

    it('creates a log with a dynamic payload', () => {
      const log = logFactoryWithPayload.createInfoLog(testMessage).build({ test: true });

      expect(log.payload?.test).toBeTruthy();
    });

    it('creates a log without a payload', () => {
      const log = logFactory.createTraceLog(testMessage).build();

      expect(log.payload).toBeUndefined();
    });
  });

  describe('Created at timestamp', () => {
    beforeEach(() => {
      fakeTime.setTime(fakeNow);
    });

    const fakeNow = new Date('2021-01-21T21:21:21Z');

    it('timestamps the log with the current date and time', () => {
      const log = logFactory.createTraceLog(testMessage).build();

      expect(new Date(log.createdAt)).toEqual(fakeNow);
    });

    it('timestamps the log with the current date and time', () => {
      const firstLog = logFactory.createWarningLog(testMessage).build();
      const fakeLater = new Date('2021-01-23T23:23:23Z');
      fakeTime.setTime(fakeLater);

      const secondLog = logFactory.createCriticalLog(testMessage).build();

      expect(new Date(firstLog.createdAt)).toEqual(fakeNow);
      expect(new Date(secondLog.createdAt)).toEqual(fakeLater);
    });
  });

  describe('Log message', () => {
    it('creates a log with a message', () => {
      const log = logFactory.createCriticalLog(testMessage).build();

      expect(log.message).toBe(testMessage);
    });

    it('creates a log with another message', () => {
      const otherMessage = 'Woodpecker';
      const log = logFactory.createCriticalLog(otherMessage).build();

      expect(log.message).toBe(otherMessage);
    });
  });

  describe('Log builder factories', () => {
    it('creats a log builder with the critical log level', () => {
      const logBuilder = logFactory.createCriticalLog(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Critical);
    });

    it('creats a log builder with the debug log level', () => {
      const logBuilder = logFactory.createDebugLog(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Debug);
    });

    it('creats a log builder with the error log level', () => {
      const logBuilder = logFactory.createErrorLog(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Error);
    });

    it('creats a log builder with the info log level', () => {
      const logBuilder = logFactory.createInfoLog(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Info);
    });

    it('creats a log builder with the trace log level', () => {
      const logBuilder = logFactory.createTraceLog(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Trace);
    });

    it('creats a log builder with the warning log level', () => {
      const logBuilder = logFactory.createWarningLog(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Warning);
    });
  });
});
