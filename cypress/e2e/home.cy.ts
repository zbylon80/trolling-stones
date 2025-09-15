describe('Strona główna', () => {
  it('wyświetla baner cookie i pozwala na akceptację', () => {
    cy.visit('/');
    cy.get('#cookie-banner', { timeout: 10000 }).should('be.visible');
    cy.get('#cookie-accept').click();
    cy.get('#cookie-banner').should('have.class', 'hidden');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('cookieConsent')).to.equal('accepted');
    });

    cy.reload();
    cy.get('#cookie-banner').should('have.class', 'hidden');
  });

  it('renderuje nagłówek, sekcję bohatera i linki społecznościowe', () => {
    cy.visitWithConsent('/');

    cy.get('header').within(() => {
      cy.contains('a', 'TRolling Stones').should('have.attr', 'href', '/');
      cy.contains('nav a', 'Koncerty').should('have.attr', 'href', '/koncerty');
      cy.contains('nav a', 'Galeria').should('have.attr', 'href', '/galeria');
      cy.contains('nav a', 'Aktualności').should('have.attr', 'href', '/aktualnosci');
      cy.contains('nav a', 'Bio').should('have.attr', 'href', '/bio');
      cy.contains('nav a', 'Skład').should('have.attr', 'href', '/sklad');
      cy.contains('nav a', 'Kontakt').should('have.attr', 'href', '/kontakt');
    });

    cy.get('img[alt="TRolling Stones - Tribute to The Rolling Stones"]').should('be.visible');
    cy.contains(
      "Rock'n'roll z pulsującą energią. Sprawdź nasze koncerty, obejrzyj klipy i bądź na bieżąco z nowościami."
    ).should('be.visible');

    cy.contains('a', 'Zobacz koncerty').should('have.attr', 'href', '/koncerty');
    cy.contains('a', 'Aktualności').should('have.attr', 'href', '/aktualnosci');

    cy.contains('h2', 'Słuchaj i obserwuj')
      .parent()
      .find('li')
      .should('have.length', 4)
      .each(($li) => {
        cy.wrap($li).find('a').should('have.attr', 'href');
      });

    cy.get('footer').contains('©').should('be.visible');
  });

  it('umożliwia przełączanie klipów w karuzeli YouTube', () => {
    cy.visitWithConsent('/');

    cy.get('#yt-container iframe').should('exist');
    cy.get('#yt-container iframe')
      .invoke('attr', 'src')
      .then((initialSrc) => {
        expect(initialSrc).to.contain('youtube');

        cy.get('button#next').click();
        cy.get('#yt-container iframe')
          .invoke('attr', 'src')
          .should((nextSrc) => {
            expect(nextSrc).to.contain('youtube');
            expect(nextSrc).to.not.equal(initialSrc);
          });

        cy.get('button#prev').click();
        cy.get('#yt-container iframe')
          .invoke('attr', 'src')
          .should((srcAfterPrev) => {
            expect(srcAfterPrev).to.equal(initialSrc);
          });
      });
  });
});
