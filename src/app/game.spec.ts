import { Board, Line, LineData, Lines } from "./board";
import { Game } from "./game";
import { updateTuple } from "./util";

describe("Game", () => {
    let game: Game;
    beforeEach(async () => {
        game = new Game();
    });
    it("should have a blank board at startup", () => {
        expect(game.board).toEqual(new Board());
    });
    describe("On the first human move", () => {
        it(`should show the human move on that square`, () => {
            const row = 0,
                column = 2;
            game.humanMove(row, column);
            expect(game.board.getSquare(row, column)).toBe("X");
        });

        it(`should show the computer move after the human move`, () => {
            const row = 0,
                column = 2;
            game.humanMove(row, column);
            expect(game.board.boardData).toContain("O");
        });
    });
    describe("During the game", () => {
        for (const symbol of ["X", "O"] as ["X", "O"]) {
            it(`should disallow human plays on an existing ${symbol} square`, () => {
                const testBoard: Board = new Board([symbol, "", "", "", "", "", "", "", ""]);
                game = new Game(testBoard);
                game.humanMove(0, 0);
                expect(game.board).withContext("Board was modified").toEqual(testBoard);
            });
        }
        describe("should have the computer win as soon as possible", () => {
            Object.values(Lines).forEach(line => {
                describe(`in the ${line.desc}`, () => {
                    ["first", "second", "third"].forEach((posOrdinal, posIndex) => {
                        it(`with the ${posOrdinal} square missing`, () => {
                            const initialBoard: Board = new Board();
                            const expectedRow: LineData = ["O", "O", "O"];
                            const initialRow = updateTuple(expectedRow, posIndex, "");
                            const testBoard: Board = initialBoard.withLine(line, initialRow);
                            const expectedBoard: Board = testBoard.withLine(line, expectedRow);
                            game = new Game(testBoard);
                            game.computerMove();
                            expect(game.board)
                                .withContext("Computer did not win")
                                .toEqual(expectedBoard);
                        });
                    });
                });
            });
        });
        describe("should have the computer block the human from winning", () => {
            Object.values(Lines).forEach(line => {
                describe(`in the ${line.desc}`, () => {
                    ["first", "second", "third"].forEach((posOrdinal, posIndex) => {
                        it(`with the ${posOrdinal} square missing`, () => {
                            const initialBoard: Board = new Board();
                            const expectedRow = updateTuple(
                                ["X", "X", "X"] as LineData,
                                posIndex,
                                "O"
                            );
                            const initialRow = updateTuple(expectedRow, posIndex, "");
                            const testBoard: Board = initialBoard.withLine(line, initialRow);
                            const expectedBoard: Board = testBoard.withLine(line, expectedRow);
                            game = new Game(testBoard);
                            game.computerMove();
                            expect(game.board)
                                .withContext("Computer did not win")
                                .toEqual(expectedBoard);
                        });
                    });
                });
            });
        });

        it("should have the computer prioritize winning over blocking", () => {
            const testBoard: Board = new Board(["X", "", "X", "", "", "", "O", "O", ""]);
            const expectedBoard: Board = testBoard.withSquareAtIndex(8, "O");
            game = new Game(testBoard);
            game.computerMove();
            expect(game.board)
                .withContext("Computer did not try to win immediately")
                .toEqual(expectedBoard);
        });
    });
});
