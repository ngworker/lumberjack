import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      // Docusaurus has no serve:development/production configs — use `start` (dev
      // server, no pre-build) so e2e does not race the static `serve` target that
      // requires packages/docs/lumberjack-docs-app/build.
      webServerCommands: {
        default: 'nx run docs-lumberjack-docs-app:start',
      },
      ciWebServerCommand: 'nx run docs-lumberjack-docs-app:start',
    }),
    baseUrl: 'http://localhost:3000',
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,
  },
});
