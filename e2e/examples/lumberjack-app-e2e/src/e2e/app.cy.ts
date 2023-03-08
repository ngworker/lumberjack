import { getTitle } from '../support/app.po';

describe('lumberjack-app', () => {
  beforeEach(() => cy.visit('/'));

  it('Smoke test: It displays a title', () => {
    getTitle().contains('lumberjack-app');
  });
});
