import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent, coordsByLine, LineSpec, LineSpecs } from "./app.component";
import { BoardData, BoardSymbol, LineData } from "./board";
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
                    expect(app.squares).toContain("X");
                    expect(app.squares).toContain("O");
                });
            });
        });
        it("should show the computer move", () => {
            fixture.componentInstance.computerMove();
            fixture.detectChanges();
            expect(fixture.componentInstance.squares.flat(1)).toContain("O");
        });
    });
    describe("Subsequent turns", () => {
        for (const symbol of ["X", "O"] as BoardSymbol[]) {
            it(`should disallow human plays on an existing ${symbol} square`, () => {
                const testSquares: BoardData = [symbol, "", "", "", "", "", "", "", ""];
                app.squares = testSquares;
                app.humanMove(0, 0);
                expect(app.squares[0][0]).toEqual(symbol);
                expect(app.squares).withContext("Board was modified").toEqual(testSquares);
            });
        }
        describe("should have the computer win as soon as possible", () => {
            ["TOP", "MIDDLE", "BOTTOM"].forEach((rowName, rowIndex) => {
                describe(`in the ${rowName.toLowerCase()} row`, () => {
                    ["first", "second", "third"].forEach((posOrdinal, posIndex) => {
                        it(`with the ${posOrdinal} square missing`, () => {
                            const initialBoard: BoardData = ["", "", "", "", "", "", "", "", ""];
                            const expectedRow = ["O", "O", "O"] as LineData;
                            const initialRow = updateTuple(expectedRow, posIndex, "");
                            const lineSpec = LineSpecs[rowName];
                            const testBoard: BoardData = updateByLine(
                                initialBoard,
                                lineSpec,
                                initialRow
                            );
                            const expectedBoard: BoardData = updateByLine(
                                initialBoard,
                                lineSpec,
                                expectedRow
                            );
                            app.squares = testBoard;
                            app.computerMove();
                            expect(app.squares)
                                .withContext("Computer did not win")
                                .toEqual(expectedBoard);
                        });
                    });
                });
            });
            it(`in the first column`, () => {
                const testBoard: BoardData = ["O", "", "", "O", "", "", "", "", ""];
                const expectedBoard: BoardData = ["O", "", "", "O", "", "", "O", "", ""];
                app.squares = testBoard;
                app.computerMove();
                expect(app.squares).withContext("Computer did not win").toEqual(expectedBoard);
            });
            it(`in a diagonal`, () => {
                const testBoard: BoardData = ["O", "", "", "", "O", "", "", "", ""];
                const expectedBoard: BoardData = updateTuple(testBoard, 8, "O");
                app.squares = testBoard;
                app.computerMove();
                expect(app.squares).withContext("Computer did not win").toEqual(expectedBoard);
            });
            it(`in an antidiagonal`, () => {
                const testBoard: BoardData = ["", "", "O", "", "O", "", "", "", ""];
                const expectedBoard: BoardData = updateTuple(testBoard, 6, "O");
                app.squares = testBoard;
                app.computerMove();
                expect(app.squares).withContext("Computer did not win").toEqual(expectedBoard);
            });
        });
        describe("should have the computer block the human from winning", () => {
            it("in a row", () => {
                const testBoard: BoardData = ["X", "", "X", "", "", "", "", "", ""];
                const expectedBoard: BoardData = updateTuple(testBoard, 1, "O");
                app.squares = testBoard;
                app.computerMove();
                expect(app.squares)
                    .withContext("Computer let the human win")
                    .toEqual(expectedBoard);
            });
            it("in a column", () => {
                const testBoard: BoardData = ["", "", "X", "", "", "X", "", "", ""];
                const expectedBoard: BoardData = updateTuple(testBoard, 8, "O");
                app.squares = testBoard;
                app.computerMove();
                expect(app.squares)
                    .withContext("Computer let the human win")
                    .toEqual(expectedBoard);
            });
            it("in a diagonal", () => {
                const testBoard: BoardData = ["", "", "", "", "X", "", "X", "", ""];
                const expectedBoard: BoardData = updateTuple(testBoard, 2, "O");
                app.squares = testBoard;
                app.computerMove();
                expect(app.squares)
                    .withContext("Computer let the human win")
                    .toEqual(expectedBoard);
            });
        });
        it("should have the computer prioritize winning over blocking", () => {
            const testBoard: BoardData = ["X", "", "X", "", "", "", "O", "O", ""];
            const expectedBoard: BoardData = updateTuple(testBoard, 8, "O");
            app.squares = testBoard;
            app.computerMove();
            expect(app.squares)
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

function updateByLine(initialBoard: BoardData, spec: LineSpec, line: LineData): BoardData {
    return [0, 1, 2].reduce((board, pos, index) => {
        const [y, x] = coordsByLine(spec, pos);
        return updateTuple(board, y * 3 + x, line[index]);
    }, initialBoard);
}
