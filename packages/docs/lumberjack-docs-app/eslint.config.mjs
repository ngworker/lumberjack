import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    ignores: ['.astro/**', '**/.astro/**'],
  },
  {
    // Vendored from naxodev/oss docs-theme; keep source identical.
    files: ['src/theme/lib/**/*.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
];
