import * as app from '../support/app.po';

describe('Legacy URL redirects', () => {
  const cases: Array<{ from: string; to: string }> = [
    { from: '/docs/usage', to: '/guides/usage' },
    { from: '/docs/installation', to: '/getting-started/installation' },
    { from: '/blog/announcing-lumberjack-v22', to: '/whats-new/announcing-lumberjack-v22' },
  ];

  for (const { from, to } of cases) {
    it(`redirects ${from} → ${to}`, () => {
      cy.visit(app.url(from));
      cy.url().should('include', app.url(to));
    });
  }
});
