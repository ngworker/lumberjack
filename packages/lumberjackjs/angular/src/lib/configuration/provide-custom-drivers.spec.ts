import { TestBed } from '@angular/core/testing';

import { createNoopDriver } from '@internal/core/test-util';
import { LumberjackLevel } from '@lumberjackjs/core';
import { LumberjackConsoleDriver } from '@lumberjackjs/core/console-driver';

import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';

import { provideLumberjackCustomDrivers } from './provide-custom-drivers';

describe(provideLumberjackCustomDrivers.name, () => {
  const consoleDriver = new LumberjackConsoleDriver({ levels: [LumberjackLevel.Verbose] });
  const noopDriver = createNoopDriver({ levels: [LumberjackLevel.Verbose] });

  it('provides the custom driver', () => {
    TestBed.configureTestingModule({
      providers: [provideLumberjackCustomDrivers(consoleDriver)],
    });
    const customDriver = TestBed.inject(lumberjackLogDriverToken);

    expect(customDriver).toBeDefined();
    expect(customDriver).toEqual([consoleDriver]);
  });

  it('provides the multiple custom drivers', () => {
    TestBed.configureTestingModule({
      providers: [provideLumberjackCustomDrivers([consoleDriver, noopDriver])],
    });
    const customDrivers = TestBed.inject(lumberjackLogDriverToken);

    expect(customDrivers).toBeDefined();
    expect(customDrivers.length).toBe(2);
    expect(customDrivers).toEqual([consoleDriver, noopDriver]);
  });
});
