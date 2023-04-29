import { LumberjackLog, LumberjackLogPayload } from '@webworkers/lumberjack';

/**
 * The data structure passed to a log driver by Lumberjack. Optionally supports
 * a log payload.
 */
export interface LumberjackLogDriverLog<TPayload extends LumberjackLogPayload | void = void> {
  describe('Dependency injection tokens', () => {
    it('exposes lumberjackLogDriverToken', () => {
      const sut = lumberjackLogDriverToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });
  });
  /**
   * The text representation of the log.
   */
  readonly formattedLog: string;
  /**
   * The log. Optionally supports a log payload.
   */
  readonly log: LumberjackLog<TPayload>;
}
