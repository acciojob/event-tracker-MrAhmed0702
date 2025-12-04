

Cypress.Commands.add("createEvent", (title, location) => {
  cy.get(".rbc-date-cell").first().click();
  cy.get('input[placeholder="Event Title"]').type(title);
  cy.get('input[placeholder="Event Location"]').type(location);
  cy.get(".mm-popup__box__footer__right-space > .mm-popup__btn").click();
});

Cypress.Commands.add("deleteAllEvents", () => {
  cy.window().then((win) => {
    win.localStorage.removeItem("calendarEvents");
  });
});
