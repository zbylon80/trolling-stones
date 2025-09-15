describe('Skład zespołu', () => {
  it('wyświetla wszystkich członków i obsługuje podgląd zdjęć', () => {
    cy.visitWithConsent('/sklad');

    cy.contains('h1', 'Skład').should('be.visible');
    cy.get('img[data-lightbox]').should('have.length', 6);
    cy.contains("Artur 'Walec' Dembicki - gitara prowadząca").should('be.visible');
    cy.contains("Zbigniew 'Zbylon' Kalinowski - wokal, harmonijka").should('be.visible');

    cy.get('img[data-lightbox]').last().click();
    cy.get('#lightbox-overlay').should('be.visible');
    cy.get('#lightbox-image').should('have.attr', 'src').and('include', '/images/members/');
    cy.get('#lightbox-backdrop').click({ force: true });
    cy.get('#lightbox-overlay').should('have.class', 'hidden');
  });
});
