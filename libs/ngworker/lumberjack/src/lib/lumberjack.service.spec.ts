import { StaticProvider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  ObjectNoopDriver,
  ObjectNoopDriverModule,
  ObjectSpyDriver,
  ObjectSpyDriverModule,
  resolveDependency,
  StringNoopDriver,
  StringNoopDriverModule,
  StringSpyDriver,
  StringSpyDriverModule,
} from '@internal/test-util';

import { ConsoleDriverModule } from '../../console-driver/src/console-driver.module';

import { LogDriverConfig, LogDriverConfigToken } from './configs';
import { ObjectLogDriver, ObjectLogDriverToken, StringLogDriver, StringLogDriverToken } from './log-drivers';
import { createDebugLog, createErrorLog, createInfoLog, createWarningLog } from './log-types';
import { LumberjackLogLevel } from './lumberjack-log-levels';
import { LumberjackModule } from './lumberjack.module';
import { LumberjackService } from './lumberjack.service';

const noLogsConfig: LogDriverConfig = {
  levels: [],
};
const noLogsProvider: StaticProvider = {
  provide: LogDriverConfigToken,
  useValue: noLogsConfig,
};
const allLogsConfig: LogDriverConfig = {
  levels: [LumberjackLogLevel.Debug, LumberjackLogLevel.Error, LumberjackLogLevel.Info, LumberjackLogLevel.Warning],
};
const allLogsProvider: StaticProvider = {
  provide: LogDriverConfigToken,
  useValue: allLogsConfig,
};
const verboseLoggingConfig: LogDriverConfig = {
  levels: [LumberjackLogLevel.Verbose],
};
const verboseLoggingProvider: StaticProvider = {
  provide: LogDriverConfigToken,
  useValue: verboseLoggingConfig,
};
const logCreators = {
  debug: createDebugLog(''),
  error: createErrorLog(''),
  info: createInfoLog(''),
  warning: createWarningLog(''),
};
const logEmptyDebugMessage = () => resolveDependency(LumberjackService).log(logCreators.debug());

describe(LumberjackService.name, () => {
  describe('Log drivers', () => {
    it('accepts logs when no log drivers are registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });

    it('accepts logs when a single string log driver is registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(), StringNoopDriverModule.forRoot()],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });

    it('accepts logs when a single object log driver is registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(), ObjectNoopDriverModule.forRoot()],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });

    it('accepts logs when multiple string log drivers are registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(), StringNoopDriverModule.forRoot(), ConsoleDriverModule.forRoot()],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });

    it('accepts logs when multiple object log drivers are registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(), ObjectNoopDriverModule.forRoot(), ObjectSpyDriverModule.forRoot()],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });

    it('accepts logs when multiple mixed log drivers are registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(), ObjectNoopDriverModule.forRoot(), StringNoopDriverModule.forRoot()],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });
  });

  describe('Log types', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          LumberjackModule.forRoot({
            format: ({ level }) => level,
          }),
          StringSpyDriverModule.forRoot(),
          ObjectSpyDriverModule.forRoot(),
        ],
      });

      lumberjack = resolveDependency(LumberjackService);

      const [stringLogDriver] = (resolveDependency(StringLogDriverToken) as unknown) as StringLogDriver[];
      const [objectLogDriver] = (resolveDependency(ObjectLogDriverToken) as unknown) as ObjectLogDriver[];
      stringSpyDriver = stringLogDriver as StringSpyDriver;
      objectSpyDriver = objectLogDriver as ObjectSpyDriver;
    });

    let lumberjack: LumberjackService;
    let stringSpyDriver: StringSpyDriver;
    let objectSpyDriver: ObjectSpyDriver;

    it('logs a debug message to a log driver', () => {
      lumberjack.log(logCreators.debug());

      expect(stringSpyDriver.logDebug).toHaveBeenCalledTimes(1);
      expect(stringSpyDriver.logDebug).toHaveBeenCalledWith(LumberjackLogLevel.Debug);

      expect(objectSpyDriver.logDebug).toHaveBeenCalledTimes(1);
      expect(objectSpyDriver.logDebug).toHaveBeenCalledWith(logCreators.debug());
    });

    it('logs an error message to a log driver', () => {
      lumberjack.log(logCreators.error());

      expect(stringSpyDriver.logError).toHaveBeenCalledTimes(1);
      expect(stringSpyDriver.logError).toHaveBeenCalledWith(LumberjackLogLevel.Error);

      expect(objectSpyDriver.logError).toHaveBeenCalledTimes(1);
      expect(objectSpyDriver.logError).toHaveBeenCalledWith(logCreators.error());
    });

    it('logs an info message to a log driver', () => {
      lumberjack.log(logCreators.info());

      expect(stringSpyDriver.logInfo).toHaveBeenCalledTimes(1);
      expect(stringSpyDriver.logInfo).toHaveBeenCalledWith(LumberjackLogLevel.Info);

      expect(objectSpyDriver.logInfo).toHaveBeenCalledTimes(1);
      expect(objectSpyDriver.logInfo).toHaveBeenCalledWith(logCreators.info());
    });

    it('logs a warning to a log driver', () => {
      lumberjack.log(logCreators.warning());

      expect(stringSpyDriver.logWarning).toHaveBeenCalledTimes(1);
      expect(stringSpyDriver.logWarning).toHaveBeenCalledWith(LumberjackLogLevel.Warning);

      expect(objectSpyDriver.logWarning).toHaveBeenCalledTimes(1);
      expect(objectSpyDriver.logWarning).toHaveBeenCalledWith(logCreators.warning());
    });
  });

  describe('Log levels', () => {
    it('accepts logs when no log levels are enabled', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [noLogsProvider],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });

    it('accepts logs when all log levels are enabled', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
        providers: [allLogsProvider],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });

    it('accepts logs when all log levels are enabled and a log driver is registered', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(), StringNoopDriverModule.forRoot()],
        providers: [allLogsProvider],
      });

      expect(logEmptyDebugMessage).not.toThrow();
    });
  });

  describe('Verbose logging', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          LumberjackModule.forRoot({
            format: ({ level }) => level,
          }),
          ObjectSpyDriverModule.forRoot(),
        ],
        providers: [verboseLoggingProvider],
      });

      lumberjack = resolveDependency(LumberjackService);

      const [logDriver] = (resolveDependency(ObjectLogDriverToken) as unknown) as ObjectLogDriver[];
      stringSpyDriver = logDriver as ObjectSpyDriver;
    });

    let lumberjack: LumberjackService;
    let stringSpyDriver: StringSpyDriver;

    describe('when a log driver is registered', () => {
      it('debug entries are logged', () => {
        lumberjack.log(logCreators.debug());

        expect(stringSpyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(stringSpyDriver.logDebug).toHaveBeenCalledWith(logCreators.debug());
      });

      it('errors are logged', () => {
        lumberjack.log(logCreators.error());

        expect(stringSpyDriver.logError).toHaveBeenCalledTimes(1);
        expect(stringSpyDriver.logError).toHaveBeenCalledWith(logCreators.error());
      });

      it('info is logged', () => {
        lumberjack.log(logCreators.info());

        expect(stringSpyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(stringSpyDriver.logInfo).toHaveBeenCalledWith(logCreators.info());
      });

      it('warnings are logged', () => {
        lumberjack.log(logCreators.warning());

        expect(stringSpyDriver.logWarning).toHaveBeenCalledTimes(1);
        expect(stringSpyDriver.logWarning).toHaveBeenCalledWith(logCreators.warning());
      });
    });
  });

  describe('Multiple log drivers', () => {
    describe('given drivers with different log levels', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            LumberjackModule.forRoot({
              format: ({ level }) => level,
            }),
            StringSpyDriverModule.forRoot({
              levels: [LumberjackLogLevel.Debug, LumberjackLogLevel.Info],
            }),
            StringNoopDriverModule.forRoot({
              levels: [LumberjackLogLevel.Error, LumberjackLogLevel.Warning],
            }),
            ObjectSpyDriverModule.forRoot({
              levels: [LumberjackLogLevel.Debug, LumberjackLogLevel.Info],
            }),
            ObjectNoopDriverModule.forRoot({
              levels: [LumberjackLogLevel.Error, LumberjackLogLevel.Warning],
            }),
          ],
          providers: [verboseLoggingProvider],
        });

        lumberjack = resolveDependency(LumberjackService);

        const [_stringSpyDriver, _stringNoopDriver] = (resolveDependency(
          StringLogDriverToken
        ) as unknown) as StringLogDriver[];
        const [_objectSpyDriver, _objectNoopDriver] = (resolveDependency(
          ObjectLogDriverToken
        ) as unknown) as ObjectLogDriver[];

        stringSpyDriver = _stringSpyDriver as StringSpyDriver;
        stringNoopDriver = _stringNoopDriver as jasmine.SpyObj<StringNoopDriver>;

        objectSpyDriver = _objectSpyDriver as ObjectSpyDriver;
        objectNoopDriver = _objectNoopDriver as jasmine.SpyObj<ObjectNoopDriver>;

        spyOn(stringNoopDriver, 'logDebug');
        spyOn(stringNoopDriver, 'logError');
        spyOn(stringNoopDriver, 'logInfo');
        spyOn(stringNoopDriver, 'logWarning');

        spyOn(objectNoopDriver, 'logDebug');
        spyOn(objectNoopDriver, 'logError');
        spyOn(objectNoopDriver, 'logInfo');
        spyOn(objectNoopDriver, 'logWarning');
      });

      beforeEach(() => {
        lumberjack.log(logCreators.debug());
        lumberjack.log(logCreators.info());
        lumberjack.log(logCreators.error());
        lumberjack.log(logCreators.warning());
      });

      let lumberjack: LumberjackService;
      let stringNoopDriver: jasmine.SpyObj<StringNoopDriver>;
      let stringSpyDriver: StringSpyDriver;
      let objectNoopDriver: jasmine.SpyObj<ObjectNoopDriver>;
      let objectSpyDriver: ObjectSpyDriver;

      it('then logs of configured levels are passed to each of them', () => {
        expect(stringSpyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(stringSpyDriver.logDebug).toHaveBeenCalledWith(LumberjackLogLevel.Debug);
        expect(stringSpyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(stringSpyDriver.logInfo).toHaveBeenCalledWith(LumberjackLogLevel.Info);

        expect(objectSpyDriver.logDebug).toHaveBeenCalledTimes(1);
        expect(objectSpyDriver.logDebug).toHaveBeenCalledWith(logCreators.debug());
        expect(objectSpyDriver.logInfo).toHaveBeenCalledTimes(1);
        expect(objectSpyDriver.logInfo).toHaveBeenCalledWith(logCreators.info());

        expect(stringNoopDriver.logError).toHaveBeenCalledTimes(1);
        expect(stringNoopDriver.logError).toHaveBeenCalledWith(LumberjackLogLevel.Error);
        expect(stringNoopDriver.logWarning).toHaveBeenCalledTimes(1);
        expect(stringNoopDriver.logWarning).toHaveBeenCalledWith(LumberjackLogLevel.Warning);

        expect(objectNoopDriver.logError).toHaveBeenCalledTimes(1);
        expect(objectNoopDriver.logError).toHaveBeenCalledWith(logCreators.error());
        expect(objectNoopDriver.logWarning).toHaveBeenCalledTimes(1);
        expect(objectNoopDriver.logWarning).toHaveBeenCalledWith(logCreators.warning());
      });

      it('then logs of other levels are not passed to either of them', () => {
        expect(stringSpyDriver.logError).not.toHaveBeenCalled();
        expect(stringSpyDriver.logWarning).not.toHaveBeenCalled();

        expect(stringNoopDriver.logDebug).not.toHaveBeenCalled();
        expect(stringNoopDriver.logInfo).not.toHaveBeenCalled();
      });
    });
  });
});
