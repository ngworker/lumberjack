const getHeroBanner = () => cy.get('.hero');

export const getCallToAction = () => getHeroBanner().contains('a', 'Get started');
export const getTitle = () => getHeroBanner().find('h1');
