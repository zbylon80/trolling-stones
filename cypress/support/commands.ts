/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Visit a page with the cookie consent already accepted to avoid the banner in tests.
       */
      visitWithConsent(url: string, options?: Partial<Cypress.VisitOptions>): Chainable<Cypress.AUTWindow>;
    }
  }
}

Cypress.Commands.add('visitWithConsent', (url: string, options: Partial<Cypress.VisitOptions> = {}) => {
  const originalOnBeforeLoad = options.onBeforeLoad;

  cy.visit(url, {
    ...options,
    onBeforeLoad(win) {
      win.localStorage.setItem('cookieConsent', 'accepted');
      if (originalOnBeforeLoad) {
        originalOnBeforeLoad(win);
      }
    },
  });
});

export {};
