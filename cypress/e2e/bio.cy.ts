describe('Strona bio', () => {
  it('prezentuje informacje o zespole', () => {
    cy.visitWithConsent('/bio');

    cy.contains('h1', 'Bio').should('be.visible');
    cy.contains('Zespół TRolling Stones założyliśmy w 2015 roku').should('be.visible');
    cy.contains('Od momentu założenia skład zmienił się tylko raz').should('be.visible');
    cy.get('section').should('have.class', 'relative');
  });
});
