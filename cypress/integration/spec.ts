describe("Tic Tac Toe", () => {
    it("shows a blank gameboard before the game starts", () => {
        cy.visit("/").get(".gameboard .square").should("have.text", "");
    });
});
