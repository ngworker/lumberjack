import nx from '@nx/eslint-plugin';
import eslintPluginSonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  ...nx.configs['flat/base'],
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/.docusaurus/**',
      '**/build/**',
      '**/tmp/**',
      '**/out-tsc/**',
      // Docusaurus config is not part of any project tsconfig; type-aware rules cannot load it.
      '**/docusaurus.config.ts',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allowCircularSelfDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:public',
              onlyDependOnLibsWithTags: ['scope:public'],
            },
            {
              sourceTag: 'scope:internal',
              onlyDependOnLibsWithTags: ['scope:public', 'scope:internal'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:package'],
            },
            {
              sourceTag: 'type:package',
              onlyDependOnLibsWithTags: ['type:package', 'type:test-util'],
            },
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: ['type:app'],
            },
          ],
        },
      ],
    },
    ignores: ['**/*.spec.ts'],
  },
  ...nx.configs['flat/typescript'],
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
  ...nx.configs['flat/javascript'],
  // Type-aware linting. projectService finds the nearest tsconfig per file so
  // lint targets that run with cwd set to a project root still resolve correctly.
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Explicitly configured before the ESLint 9 migration.
      '@typescript-eslint/prefer-readonly': 'error',
    },
  },
  // Keep only the sonarjs rule that was explicitly configured pre-migration.
  // eslint-plugin-sonarjs v4's recommended set enables many new rules that
  // were not enforced under v0.17. eslint-plugin-etc, eslint-plugin-rxjs, and
  // eslint-plugin-ordered-imports do not support ESLint 9 and were removed.
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      sonarjs: eslintPluginSonarjs,
    },
    rules: {
      'sonarjs/cognitive-complexity': ['error', 8],
    },
  },
  // Angular v22's change-detection-eager migration writes ChangeDetectionStrategy.Eager
  // to preserve pre-v22 Default behavior. That trips prefer-on-push (a preset default
  // that was not user-configured). Keep migration output; disable the preset rule.
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  }
);
