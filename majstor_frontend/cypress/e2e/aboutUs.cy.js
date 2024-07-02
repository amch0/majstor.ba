describe("About Us Page", () => {
  it("should send an email through the contact form", () => {
    cy.intercept("POST", "http://localhost:8080/contact").as("sendEmail");
    cy.visit("http://localhost:5173/aboutUs");

    cy.get('input[placeholder="Name"]').type("John Doe");
    cy.get('input[placeholder="Email"]').type("john.doe@example.com");
    cy.get('input[placeholder="3876xxxxxxx"]').type("123456789");
    cy.get('textarea[placeholder="Your message"]').type(
      "Test message for Cypress."
    );

    cy.get('button[type="submit"]').click();
    cy.wait("@sendEmail").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });
});
