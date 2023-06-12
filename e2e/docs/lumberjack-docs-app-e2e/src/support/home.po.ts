const getHeroBanner = () => cy.get('.hero');

export const getCallToAction = () => getHeroBanner().find('a');
export const getTitle = () => getHeroBanner().find('h1');
