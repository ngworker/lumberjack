import * as app from '../support/app.po';

describe('Legacy URL redirects', () => {
  const cases: Array<{ from: string; to: string }> = [
    { from: '/docs/usage', to: '/guides/log-with-the-service' },
    { from: '/docs/installation', to: '/getting-started/installation' },
    { from: '/docs/best-practices', to: '/guides/write-a-logger' },
    { from: '/docs/log-drivers', to: '/understanding/log-drivers' },
    { from: '/guides/usage', to: '/guides/log-with-the-service' },
    { from: '/blog/announcing-lumberjack-v22', to: '/whats-new/announcing-lumberjack-v22' },
  ];

  for (const { from, to } of cases) {
    it(`redirects ${from} → ${to}`, () => {
      cy.visit(app.url(from));
      cy.url().should('include', app.url(to));
    });
  }
});
