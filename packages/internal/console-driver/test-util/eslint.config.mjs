import baseConfig from '../../../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'ngworker',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ngworker',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-standalone': 'off',
      // Angular v22 change-detection-eager migration; keep Eager (pre-v22 Default).
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
  ...nx.configs['flat/angular-template'],
];
