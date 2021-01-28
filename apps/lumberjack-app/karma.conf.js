const path = require('path');

const getBaseKarmaConfig = require('../../karma.conf');

module.exports = (config) => {
  const baseConfig = getBaseKarmaConfig();
  config.set({
    ...baseConfig,
    coverageReporter: {
      ...baseConfig.coverageReporter,
      dir: path.join(__dirname, '../../coverage/apps/lumberjack-app'),
    },
  });
};
