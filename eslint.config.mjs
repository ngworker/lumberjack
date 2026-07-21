import nx from '@nx/eslint-plugin';
import rxjs from '@smarttools/eslint-plugin-rxjs';
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
  // Restore the pre-migration RxJS lint coverage. The original eslint-plugin-rxjs
  // has no ESLint 9 support, so we use the maintained @smarttools fork, which ships
  // the same `recommended` bug-pattern set (no-nested-subscribe, no-unsafe-takeuntil,
  // no-ignored-*, etc.). Type-aware, so scope to TS; the projectService parser is
  // configured in the type-aware block above. eslint-plugin-etc and
  // eslint-plugin-ordered-imports have no ESLint 9 support and remain removed.
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@smarttools/rxjs': rxjs,
    },
    rules: {
      ...rxjs.configs.recommended.rules,
    },
  },
  // sonarjs v4's recommended set enables many style rules that were not enforced
  // under v0.17, so we opt in explicitly rather than adopting `recommended`. Keep
  // the pre-migration cognitive-complexity rule and re-enable the bug-pattern rules
  // that recommended provided (copy-paste and identical-branch defects) — those
  // catch real logic errors, not style.
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      sonarjs: eslintPluginSonarjs,
    },
    rules: {
      'sonarjs/cognitive-complexity': ['error', 8],
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-element-overwrite': 'error',
      'sonarjs/no-ignored-return': 'error',
      'sonarjs/no-use-of-empty-return-value': 'error',
    },
  },
  // Angular v22's change-detection-eager migration writes ChangeDetectionStrategy.Eager
  // to preserve pre-v22 Default behavior in the example app. That trips prefer-on-push
  // (a preset default that was not user-configured). Scope the disable to the example
  // project so the guardrail stays active for library and future component code.
  {
    files: ['packages/examples/**/*.ts'],
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  }
);
