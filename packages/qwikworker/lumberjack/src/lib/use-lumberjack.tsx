import { $, createContextId, useContext, useContextProvider } from '@builder.io/qwik';

import {
  createLumberjack,
  createLumberjackConfig,
  createLumberjackLogDriverLogger,
  createLumberjackLogFormatter,
  Lumberjack,
  LumberjackLevel,
  LumberjackLog,
} from '@webworker/lumberjack';

import { createLumberjackConsoleDriver, driverIdentifier } from './temp-console.driver';

// Context
const LumberjackContext = createContextId<Lumberjack>('LumberjackContext');

// Provider
export function useLumberjackProvider() {
  const getUnixEpochTicks = () => new Date().valueOf();
  const lumberjack = createLumberjack({
    drivers: [
      createLumberjackConsoleDriver({
        identifier: driverIdentifier,
        levels: [LumberjackLevel.Verbose],
      }),
    ],
    getUnixEpochTicks,
    logDriverLogger: createLumberjackLogDriverLogger(),
    logFormatter: createLumberjackLogFormatter({ config: createLumberjackConfig(false), getUnixEpochTicks }),
  });

  const lumberjackLogMethod = lumberjack.log.bind(lumberjack);
  const qwikifiedLumberjackLogMethod = $((lumberjackLog: LumberjackLog) => lumberjackLogMethod(lumberjackLog));

  useContextProvider(LumberjackContext, lumberjack);
}

// Hook
export function useLumberjack() {
  const lumberjack = useContext<Lumberjack>(LumberjackContext);

  if (lumberjack === undefined) {
    throw new Error('useLumberjack must be used after a useLumberjackPrvider was invoked');
  }
  return lumberjack;
}

// Parent Component
// useLumberjackProvier()

// Consumer/Child Component
// const lumberjack = useLumberjack()
