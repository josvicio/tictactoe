describe("Tic Tac Toe", () => {
    it("shows a blank gameboard before the game starts", () => {
        cy.visit("/").get(".gameboard .square").should("have.text", "");
    });
    it("should show an X in a square when it's clicked", () => {
        cy.visit("/").get(".gameboard .square").first().click().should("have.text", "X");
    });
});
