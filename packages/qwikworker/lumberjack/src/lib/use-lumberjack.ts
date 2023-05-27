import { ContextId, createContextId, Signal, useContext, useContextProvider, useSignal } from '@builder.io/qwik';

import {
  configFactory,
  createLumberjack,
  createLumberjackLogFormatter,
  Lumberjack,
  LumberjackLevel,
  lumberjackLogDriverLoggerFactory,
  LumberjackLogPayload,
} from '@webworker/lumberjack';

type LumberjackContextId<TPayload extends LumberjackLogPayload | void = void> = ContextId<Signal<Lumberjack<TPayload>>>;

// Context
const LumberjackContext = createContextId<Signal<Lumberjack>>('LumberjackContext');

// Provider
export function useLumberjackProvider<TPayload extends LumberjackLogPayload | void = void>() {
  const getUnixEpochTicks = () => new Date().valueOf();
  const lumberjack = createLumberjack<TPayload>({
    drivers: [],
    getUnixEpochTicks,
    logDriverLogger: lumberjackLogDriverLoggerFactory(),
    logFormatter: createLumberjackLogFormatter({ config: configFactory(false), getUnixEpochTicks }),
  });

  const lumberjackSignal = useSignal<Lumberjack<TPayload>>(lumberjack);

  useContextProvider(LumberjackContext as LumberjackContextId<TPayload>, lumberjackSignal);
}

// Hook
export function useLumberjack<TPayload extends LumberjackLogPayload | void = void>() {
  const lumberjack = useContext<Signal<Lumberjack<TPayload>>>(LumberjackContext as LumberjackContextId<TPayload>);

  if (lumberjack === undefined) {
    throw new Error('useLumberjack must be used after a useLumberjackPrvider was invoked');
  }
  return lumberjack;
}

// Parent Component
// useLumberjackProvier()

// Consumer/Child Component
// const lumberjack = useLumberjack()
