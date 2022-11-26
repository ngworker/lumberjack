describe('Console log driver', () => {
  function visit() {
    cy.visit('/', {
      onBeforeLoad(win): void {
        cy.stub(win.console, 'error').as('consoleError');
        cy.stub(win.console, 'info').as('consoleInfo');
      },
    });
  }

  const expectedPayload = {
    angularVersion: '15',
  };
  it('logs a greeting info message', () => {
    visit();

    cy.get('@consoleInfo').should('have.been.calledWith', 'info [Forest App] Hello, Forest!', expectedPayload);
  });

  it('logs a critical forest fire message after 2 seconds', () => {
    cy.clock();
    visit();

    cy.tick(2000);
    cy.get('@consoleError').should(
      'have.been.calledWith',
      'critical [Forest App] The forest is on fire!',
      expectedPayload
    );
  });
});
