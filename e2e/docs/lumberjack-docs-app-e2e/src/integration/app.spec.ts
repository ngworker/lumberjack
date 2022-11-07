import { getGreeting } from '../support/app.po';

describe('docs-lumberjack-docs-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Welcome docs-lumberjack-docs-app');
  });
});
