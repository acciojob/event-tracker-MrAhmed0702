it("should delete an event", () => {
  cy.visit("/");
  cy.get(".rbc-calendar", { timeout: 10000 }).should("be.visible");

  cy.get(".rbc-calendar").click(100, 120);


  cy.get('input[placeholder="Event Title"]').type("To be deleted");
  cy.get('input[placeholder="Event Location"]').type("Test");


  cy.contains("button", "Save").click();


  cy.get(".rbc-event", { timeout: 4000 }).should("exist");


  cy.get(".rbc-event").first().click();
  cy.get(".mm-popup__btn--danger").click();


  cy.get(".rbc-event").should("not.exist");
});
