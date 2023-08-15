const nxPreset = require('@nx/jest/preset').default;

/**
 * We need to reset the mocks for each test to prevent the mocks being reused and affect the next test.
 *
 * For example in the lumberjack-orchestrator.service.spec.ts file some test were keeping the count of calls from previous usages of the spy.
 * */
module.exports = {
  ...nxPreset,
  resetMocks: true,
  /* TODO: Update to latest Jest snapshotFormat
   * By default Nx has kept the older style of Jest Snapshot formats
   * to prevent breaking of any existing tests with snapshots.
   * It's recommend you update to the latest format.
   * You can do this by removing snapshotFormat property
   * and running tests with --update-snapshot flag.
   * Example: "nx affected --targets=test --update-snapshot"
   * More info: https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
   */
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
};
