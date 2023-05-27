import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import { qwikNxVite } from 'qwik-nx/plugins';
import { qwikVite } from '@builder.io/qwik/optimizer';

export default defineConfig({
  cacheDir: '../../../node_modules/.vite/packages/qwikworker/lumberjack',
  plugins: [qwikNxVite(), qwikVite(), tsconfigPaths({ root: '../../../' })],

  test: {
    globals: true,
    cache: {
      dir: '../../../node_modules/.vitest',
    },
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      reportsDirectory: '../../../coverage/packages/qwikworker/lumberjack',
    },
  },
});
