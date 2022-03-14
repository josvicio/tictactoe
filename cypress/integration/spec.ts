beforeEach(() => {
    cy.visit("/");
});

const allSquares = "[data-test=gameboard] [data-test=square]";

describe("At the beginning of the game", () => {
    it("shows a blank gameboard before the game starts", () => {
        cy.get(allSquares).should("have.text", "");
    });
});

describe("First move", () => {
    forAllSquares((row, column) => {
        describe(`at (${column}, ${row})`, () => {
            const square = squareAt(row, column);
            it("should show the human's first move", () => {
                cy.get(square).click().invoke("attr", "data-symbol").should("eq", "X");
                cy.get("[data-test=gameboard] [data-symbol=X]").should("have.length", 1);
            });

            it("should show computer's move after human's move", () => {
                cy.get(square).first().click().invoke("attr", "data-symbol").should("eq", "X");
                cy.get("[data-test=gameboard] [data-symbol=X]").should("have.length", 1);
                cy.get("[data-test=gameboard] [data-symbol=O]").should("have.length", 1);
            });
        });
    });
    it("should show a human move by keyboard input", () => {
        cy.get("body").trigger("keypress", { key: "6" });
        cy.get(squareAt(1, 2)).invoke("attr", "data-symbol").should("eq", "X");
        cy.get("[data-test=gameboard] [data-symbol=X]").should("have.length", 1);
    });
});
describe("subsequent moves", () => {
    it("should disallow moves on an existing X square", () => {
        cy.get(squareAt(0, 0)).click().click();
        cy.get("[data-test=gameboard] [data-symbol=X]").should("have.length", 1);
        cy.get("[data-test=gameboard] [data-symbol=O]").should("have.length", 1);
    });
    it("should disallow moves on an existing O square", () => {
        cy.get(squareAt(0, 0)).click();
        cy.get("[data-test=gameboard] [data-symbol=O]").click();
        cy.get("[data-test=gameboard] [data-symbol=X]").should("have.length", 1);
        cy.get("[data-test=gameboard] [data-symbol=O]").should("have.length", 1);
    });
});

function squareAt(row: number, column: number): string {
    return `[data-test=square][data-row=${row}][data-column=${column}]`;
}
function forAllSquares(callback: (row: number, column: number) => void) {
    for (const row of [0, 1, 2]) {
        for (const column of [0, 1, 2]) {
            callback(row, column);
        }
    }
}
