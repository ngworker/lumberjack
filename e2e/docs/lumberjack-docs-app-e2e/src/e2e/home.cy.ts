import * as app from '../support/app.po';
import * as home from '../support/home.po';

describe('Home page', () => {
  beforeEach(() => cy.visit(app.url('/')));

  it('displays a title', () => {
    home.getTitle().contains('Lumberjack');
  });

  it('links to the documentation', () => {
    home.getCallToAction().click();

    cy.url().should('include', app.url('/docs'));
  });
});
