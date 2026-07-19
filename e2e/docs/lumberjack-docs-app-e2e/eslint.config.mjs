import baseConfig from '../../../eslint.config.mjs';
import cypress from 'eslint-plugin-cypress';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      cypress,
    },
    languageOptions: {
      globals: Object.fromEntries(
        Object.entries(cypress.environments.globals.globals).map(([name, writable]) => [
          name,
          writable ? 'writable' : 'readonly',
        ])
      ),
    },
    rules: {
      'cypress/no-assigning-return-values': 'error',
      'cypress/no-unnecessary-waiting': 'error',
      'cypress/no-async-tests': 'error',
      'cypress/unsafe-to-chain-command': 'error',
    },
  },
  {
    files: ['src/plugins/index.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-undef': 'off',
    },
  },
];
