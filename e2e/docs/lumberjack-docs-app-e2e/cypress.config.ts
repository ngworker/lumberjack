import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run docs-lumberjack-docs-app:serve:development',
        production: 'nx run docs-lumberjack-docs-app:serve:production',
      },
      ciWebServerCommand: 'nx run docs-lumberjack-docs-app:start',
    }),
    baseUrl: 'http://localhost:3000',
  },
});
