describe('Aktualności', () => {
  it('osadza wtyczkę Facebooka z poprawnymi parametrami', () => {
    cy.visitWithConsent('/aktualnosci');

    cy.contains('h1', 'Aktualności').should('be.visible');
    cy.get('#facebook-feed-iframe')
      .should('be.visible')
      .and('have.attr', 'title', 'Posty z Facebooka - TRolling Stones')
      .and('have.attr', 'src')
      .then((src) => {
        expect(src).to.contain('facebook.com');
        expect(src).to.match(/width=(?:[2-4]\d\d|500)/);
        expect(src).to.contain('height=1200');
      });

    cy.get('#facebook-feed-iframe').should('have.attr', 'data-current-width');
  });
});
