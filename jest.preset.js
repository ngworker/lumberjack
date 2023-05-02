const nxPreset = require('@nrwl/jest/preset').default;

/**
 * We need to reset the mocks for each test to prevent the mocks being reused and affect the next test.
 *
 * For example in the lumberjack.service.spec.ts file some test were keeping the count of calls from previous usages of the spy.
 * */
module.exports = { ...nxPreset, resetMocks: true };
