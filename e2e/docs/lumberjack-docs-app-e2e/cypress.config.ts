import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      // Astro dev server (docs-lumberjack-docs-app:start) — no pre-build needed; port pinned to 3000 in astro.config.mjs.
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
