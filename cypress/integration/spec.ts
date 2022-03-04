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
    forAllSquares((row, column) => {
        describe(`at (${column}, ${row})`, () => {
            const square = squareAt(row, column);
            it("should show the human's first move", () => {
                cy.get(square).click().should("have.text", "X");
            });

            it("should show computer's move after human's move", () => {
                cy.get(square).first().click().should("have.text", "X");
                cy.get(squareSelector).contains("O");
            });
        });
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
