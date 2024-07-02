describe("Login Functionality", () => {
  it("should successfully log in with valid credentials", () => {
    cy.visit("http://localhost:5173/login");
    cy.get('input[type="email"]').type("adisa@gmail.com");
    cy.get('input[type="password"]').type("Ahmedreal");
    cy.get("button").contains("Log In").click();
    cy.url().should("include", "/myAcc");
  });
});
