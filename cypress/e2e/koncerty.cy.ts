describe('Strona koncertów', () => {
  it('pokazuje najbliższe wydarzenia', () => {
    cy.visitWithConsent('/koncerty');

    cy.contains('h1', 'Koncerty').should('be.visible');
    cy.contains('Nadchodzące daty występów.').should('be.visible');
    cy.contains('6.12.2025').should('be.visible');
    cy.contains('Gdynia - Blues Club').should('be.visible');
    cy.contains('Sprzedaż wkrótce').should('be.visible');
  });
});
