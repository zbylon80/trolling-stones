describe('Strona kontaktowa', () => {
  it('prezentuje dane kontaktowe i linki społecznościowe', () => {
    cy.visitWithConsent('/kontakt');

    cy.contains('h1', 'Kontakt').should('be.visible');
    cy.contains('Manager Daniel Macidłowski').should('be.visible');
    cy.contains('a', 'booking@trollingstones.pl')
      .should('have.attr', 'href')
      .and('include', 'mailto:booking@trollingstones.pl');
    cy.contains('a', '+48 509 243 245')
      .should('have.attr', 'href')
      .and('include', 'tel:+48509243245');
    cy.contains('a', 'Rider techniczny (PDF)')
      .should('have.attr', 'href')
      .and('include', '/assets/Rider-techniczy-Trolling-Stones-25.03.2025.pdf');

    cy.contains('h2', 'Social media').next('ul').find('li').should('have.length', 4);

    cy.get('img[data-lightbox]').first().click();
    cy.get('#lightbox-overlay').should('be.visible');
    cy.get('body').type('{esc}');
    cy.get('#lightbox-overlay').should('have.class', 'hidden');
  });
});
