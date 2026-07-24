import * as app from '../support/app.po';

describe('Site chrome', () => {
  // Splash hides the full sidebar; exercise chrome on a normal docs page.
  beforeEach(() => {
    cy.visit(app.url('/guides/log-with-the-service/'));
  });

  it('toggles dark/light theme', () => {
    cy.document().then((doc) => {
      const before = doc.documentElement.dataset['theme'] ?? 'dark';
      const expected = before === 'dark' ? 'light' : 'dark';

      cy.get('starlight-theme-select .theme-toggle').click();
      cy.get('html').should('have.attr', 'data-theme', expected);
    });
  });

  it('exposes search control (opens when Pagefind is available)', () => {
    // Pagefind index is produced at build time. `astro dev` may leave the
    // control disabled; production/`astro preview` enables it.
    cy.get('button[data-open-modal]')
      .should('exist')
      .then(($btn) => {
        if ($btn.is(':disabled')) {
          return;
        }
        cy.wrap($btn).click();
        cy.get('site-search dialog[open]').should('exist');
      });
  });

  it('exposes github, npm, and discord social links', () => {
    cy.get('a[href="https://github.com/ngworker/lumberjack"]').should('be.visible');
    cy.get('a[href="https://www.npmjs.com/package/@ngworker/lumberjack"]').should('be.visible');
    cy.get('a[href="https://discord.gg/UDUa8MA6Ef"]').should('be.visible');
  });
});
