import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    ignores: ['.astro/**', '**/.astro/**'],
  },
];
