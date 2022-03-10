import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { Board, BoardSymbol, LineData, Lines } from "./board";
import { SquareComponent } from "./square/square.component";
import { updateTuple } from "./util";

describe("Game board", () => {
    let fixture: ComponentFixture<AppComponent>;
    let app: AppComponent;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent, SquareComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        app = fixture.componentInstance;
    });
    describe("First turn", () => {
        forAllSquares((row, column) => {
            describe(`Human moves at (${column}, ${row})`, () => {
                it(`should show the human move on that square`, () => {
                    app.humanMove(row, column);
                    expect(app.getSquare(row, column)).toBe("X");
                });
                it(`should show the following computer move in a different square`, () => {
                    app.humanMove(row, column);
                    fixture.detectChanges();
                    expect(app.board.boardData).toContain("X");
                    expect(app.board.boardData).toContain("O");
                });
            });
        });
        it("should show the computer move", () => {
            fixture.componentInstance.computerMove();
            fixture.detectChanges();
            expect(fixture.componentInstance.board.boardData).toContain("O");
        });
    });
    describe("Subsequent turns", () => {
        for (const symbol of ["X", "O"] as BoardSymbol[]) {
            it(`should disallow human plays on an existing ${symbol} square`, () => {
                const testSquares: Board = new Board([symbol, "", "", "", "", "", "", "", ""]);
                app.board = testSquares;
                app.humanMove(0, 0);
                expect(app.board.getSquare(0, 0)).toEqual(symbol);
                expect(app.board).withContext("Board was modified").toEqual(testSquares);
            });
        }
        describe("should have the computer win as soon as possible", () => {
            ["TOP", "MIDDLE", "BOTTOM"].forEach((rowName, rowIndex) => {
                describe(`in the ${rowName.toLowerCase()} row`, () => {
                    ["first", "second", "third"].forEach((posOrdinal, posIndex) => {
                        it(`with the ${posOrdinal} square missing`, () => {
                            const initialBoard: Board = new Board();
                            const expectedRow = ["O", "O", "O"] as LineData;
                            const initialRow = updateTuple(expectedRow, posIndex, "");
                            const line = Lines[rowName];
                            const testBoard: Board = initialBoard.withLine(line, initialRow);
                            const expectedBoard: Board = testBoard.withLine(line, expectedRow);
                            app.board = testBoard;
                            app.computerMove();
                            expect(app.board)
                                .withContext("Computer did not win")
                                .toEqual(expectedBoard);
                        });
                    });
                });
            });
            it(`in the first column`, () => {
                const testBoard: Board = new Board(["O", "", "", "O", "", "", "", "", ""]);
                const expectedBoard: Board = new Board(["O", "", "", "O", "", "", "O", "", ""]);
                app.board = testBoard;
                app.computerMove();
                expect(app.board).withContext("Computer did not win").toEqual(expectedBoard);
            });
            it(`in a diagonal`, () => {
                const testBoard: Board = new Board(["O", "", "", "", "O", "", "", "", ""]);
                const expectedBoard: Board = testBoard.withSquareAtIndex(8, "O");
                app.board = testBoard;
                app.computerMove();
                expect(app.board).withContext("Computer did not win").toEqual(expectedBoard);
            });
            it(`in an antidiagonal`, () => {
                const testBoard: Board = new Board(["", "", "O", "", "O", "", "", "", ""]);
                const expectedBoard: Board = testBoard.withSquareAtIndex(6, "O");
                app.board = testBoard;
                app.computerMove();
                expect(app.board).withContext("Computer did not win").toEqual(expectedBoard);
            });
        });
        describe("should have the computer block the human from winning", () => {
            it("in a row", () => {
                const testBoard: Board = new Board(["X", "", "X", "", "", "", "", "", ""]);
                const expectedBoard: Board = testBoard.withSquareAtIndex(1, "O");
                app.board = testBoard;
                app.computerMove();
                expect(app.board).withContext("Computer let the human win").toEqual(expectedBoard);
            });
            it("in a column", () => {
                const testBoard: Board = new Board(["", "", "X", "", "", "X", "", "", ""]);
                const expectedBoard: Board = testBoard.withSquareAtIndex(8, "O");
                app.board = testBoard;
                app.computerMove();
                expect(app.board).withContext("Computer let the human win").toEqual(expectedBoard);
            });
            it("in a diagonal", () => {
                const testBoard: Board = new Board(["", "", "", "", "X", "", "X", "", ""]);
                const expectedBoard: Board = testBoard.withSquareAtIndex(2, "O");
                app.board = testBoard;
                app.computerMove();
                expect(app.board).withContext("Computer let the human win").toEqual(expectedBoard);
            });
        });
        it("should have the computer prioritize winning over blocking", () => {
            const testBoard: Board = new Board(["X", "", "X", "", "", "", "O", "O", ""]);
            const expectedBoard: Board = testBoard.withSquareAtIndex(8, "O");
            app.board = testBoard;
            app.computerMove();
            expect(app.board)
                .withContext("Computer did not try to win immediately")
                .toEqual(expectedBoard);
        });
    });
});

function forAllSquares(callback: (row: number, column: number) => void) {
    for (const row of [0, 1, 2]) {
        for (const column of [0, 1, 2]) {
            callback(row, column);
        }
    }
}
