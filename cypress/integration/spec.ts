beforeEach(() => {
    cy.visit("/");
});

const squareSelector = "[data-test=gameboard] [data-test=square]";

describe("At the beginning of the game", () => {
    it("shows a blank gameboard before the game starts", () => {
        cy.get(squareSelector).should("have.text", "");
    });
});

describe("First move", () => {
    it("should show the human's first move", () => {
        cy.get(squareSelector).first().click().should("have.text", "X");
    });
});
