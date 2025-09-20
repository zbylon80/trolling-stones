describe('Galeria zdjęć', () => {
  it('otwiera podgląd zdjęć w lightboxie', () => {
    cy.visitWithConsent('/galeria');

    cy.get('img[data-lightbox]').should('have.length', 5);
    cy.get('img[data-lightbox]').first().then(($img) => {
      const altText = $img.attr('alt');
      cy.wrap($img).click();

      cy.get('#lightbox-overlay').should('be.visible');
      cy.get('#lightbox-image')
        .should('have.attr', 'src')
        .and('include', 'poster01');
      if (altText) {
        cy.get('#lightbox-caption').should('contain', altText);
      }

      cy.get('#lightbox-close').click();
      cy.get('#lightbox-overlay').should('have.class', 'hidden');
    });
  });
});
