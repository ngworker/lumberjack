import { TestBed } from '@angular/core/testing';

import { FakeTimeService } from '@internal/angular/test-util';
import { LumberjackLevel, LumberjackLogBuilder, LumberjackLogPayload } from '@lumberjackjs/core';

import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogBuilderFactoryService } from './lumberjack-log-factory.service';

describe(LumberjackLogBuilderFactoryService.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }, LumberjackLogBuilderFactoryService],
    });

    fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
    logBuilderFactory = TestBed.inject(LumberjackLogBuilderFactoryService);
  });

  const testMessage = 'Test message';
  let fakeTime: FakeTimeService;
  let logBuilderFactory: LumberjackLogBuilderFactoryService;

  describe('Log levels', () => {
    it('creates a critical log', () => {
      const log = logBuilderFactory.createCriticalLog(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Critical);
    });

    it('creates a debug log', () => {
      const log = logBuilderFactory.createDebugLog(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Debug);
    });

    it('creates a error log', () => {
      const log = logBuilderFactory.createErrorLog(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Error);
    });

    it('creates a info log', () => {
      const log = logBuilderFactory.createInfoLog(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Info);
    });

    it('creates a trace log', () => {
      const log = logBuilderFactory.createTraceLog(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Trace);
    });

    it('creates a warning log', () => {
      const log = logBuilderFactory.createWarningLog(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Warning);
    });
  });

  describe('Scope', () => {
    it('creates a log with a scope', () => {
      const testScope = 'Test scope';
      const log = logBuilderFactory.createCriticalLog(testMessage).withScope(testScope).build();

      expect(log.scope).toBe(testScope);
    });

    it('creates a log without a scope', () => {
      const log = logBuilderFactory.createDebugLog(testMessage).build();

      expect(log.scope).toBeUndefined();
    });
  });

  describe('Payload', () => {
    interface TestPayload extends LumberjackLogPayload {
      readonly test: boolean;
    }

    beforeEach(() => {
      logFactoryWithPayload = TestBed.inject(LumberjackLogBuilderFactoryService);
    });

    let logFactoryWithPayload: LumberjackLogBuilderFactoryService<TestPayload>;

    it('creates a log with a static payload', () => {
      const log = logFactoryWithPayload.createErrorLog(testMessage).withPayload({ test: true }).build();

      expect(log.payload?.test).toBeTruthy();
    });

    it('creates a log with a dynamic payload', () => {
      const log = logFactoryWithPayload.createInfoLog(testMessage).build({ test: true });

      expect(log.payload?.test).toBeTruthy();
    });

    it('creates a log without a payload', () => {
      const log = logBuilderFactory.createTraceLog(testMessage).build();

      expect(log.payload).toBeUndefined();
    });
  });

  describe('Created at timestamp', () => {
    beforeEach(() => {
      fakeTime.setTime(fakeNow);
    });

    const fakeNow = new Date('2021-01-21T21:21:21Z');

    it('timestamps the log with the current date and time', () => {
      const log = logBuilderFactory.createTraceLog(testMessage).build();

      expect(new Date(log.createdAt)).toEqual(fakeNow);
    });

    it('timestamps the log with the current date and time', () => {
      const firstLog = logBuilderFactory.createWarningLog(testMessage).build();
      const fakeLater = new Date('2021-01-23T23:23:23Z');
      fakeTime.setTime(fakeLater);

      const secondLog = logBuilderFactory.createCriticalLog(testMessage).build();

      expect(new Date(firstLog.createdAt)).toEqual(fakeNow);
      expect(new Date(secondLog.createdAt)).toEqual(fakeLater);
    });
  });

  describe('Log message', () => {
    it('creates a log with a message', () => {
      const log = logBuilderFactory.createCriticalLog(testMessage).build();

      expect(log.message).toBe(testMessage);
    });

    it('creates a log with another message', () => {
      const otherMessage = 'Woodpecker';
      const log = logBuilderFactory.createCriticalLog(otherMessage).build();

      expect(log.message).toBe(otherMessage);
    });
  });

  describe('Log builder factories', () => {
    it('creats a log builder with the critical log level', () => {
      const logBuilder = logBuilderFactory.createCriticalLog(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Critical);
    });

    it('creats a log builder with the debug log level', () => {
      const logBuilder = logBuilderFactory.createDebugLog(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Debug);
    });

    it('creats a log builder with the error log level', () => {
      const logBuilder = logBuilderFactory.createErrorLog(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Error);
    });

    it('creats a log builder with the info log level', () => {
      const logBuilder = logBuilderFactory.createInfoLog(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Info);
    });

    it('creats a log builder with the trace log level', () => {
      const logBuilder = logBuilderFactory.createTraceLog(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Trace);
    });

    it('creats a log builder with the warning log level', () => {
      const logBuilder = logBuilderFactory.createWarningLog(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Warning);
    });
  });
});
