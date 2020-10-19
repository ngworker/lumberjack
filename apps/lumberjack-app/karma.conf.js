const path = require('path');

const getBaseKarmaConfig = require('../../karma.conf');

module.exports = (config) => {
  const baseConfig = getBaseKarmaConfig();
  config.set({
    ...baseConfig,
    coverageIstanbulReporter: {
      ...baseConfig.coverageIstanbulReporter,
      dir: path.join(__dirname, '../../coverage/apps/lumberjack-app'),
    },
  });
};
