import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
    AppComponent,
    Board,
    coordsByLine,
    Line,
    LineSpec,
    LineSpecs,
    Symbol
} from "./app.component";
import { SquareComponent } from "./square/square.component";

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
        for (const symbol of ["X", "O"] as Symbol[]) {
            it(`should disallow human plays on an existing ${symbol} square`, () => {
                const testSquares: Board = [symbol, "", "", "", "", "", "", "", ""];
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
                            const initialBoard: Board = ["", "", "", "", "", "", "", "", ""];
                            const expectedRow = ["O", "O", "O"] as Line;
                            const initialRow = updateTuple(expectedRow, posIndex, "");
                            const lineSpec = LineSpecs[rowName];
                            const testBoard: Board = updateByLine(
                                initialBoard,
                                lineSpec,
                                initialRow
                            );
                            const expectedBoard: Board = updateByLine(
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
                const testBoard: Board = ["O", "", "", "O", "", "", "", "", ""];
                const expectedBoard: Board = ["O", "", "", "O", "", "", "O", "", ""];
                app.squares = testBoard;
                app.computerMove();
                expect(app.squares).withContext("Computer did not win").toEqual(expectedBoard);
            });
            it(`in a diagonal`, () => {
                const testBoard: Board = ["O", "", "", "", "O", "", "", "", ""];
                const expectedBoard: Board = updateTuple(testBoard, 8, "O");
                app.squares = testBoard;
                app.computerMove();
                expect(app.squares).withContext("Computer did not win").toEqual(expectedBoard);
            });
            it(`in an antidiagonal`, () => {
                const testBoard: Board = ["", "", "O", "", "O", "", "", "", ""];
                const expectedBoard: Board = updateTuple(testBoard, 6, "O");
                app.squares = testBoard;
                app.computerMove();
                expect(app.squares).withContext("Computer did not win").toEqual(expectedBoard);
            });
        });
        describe("should have the computer block the human from winning", () => {
            it("in a row", () => {
                const testBoard: Board = ["X", "", "X", "", "", "", "", "", ""];
                const expectedBoard: Board = updateTuple(testBoard, 1, "O");
                app.squares = testBoard;
                app.computerMove();
                expect(app.squares)
                    .withContext("Computer let the human win")
                    .toEqual(expectedBoard);
            });
            it("in a column", () => {
                const testBoard: Board = ["", "", "X", "", "", "X", "", "", ""];
                const expectedBoard: Board = updateTuple(testBoard, 8, "O");
                app.squares = testBoard;
                app.computerMove();
                expect(app.squares)
                    .withContext("Computer let the human win")
                    .toEqual(expectedBoard);
            });
            it("in a diagonal", () => {
                const testBoard: Board = ["", "", "", "", "X", "", "X", "", ""];
                const expectedBoard: Board = updateTuple(testBoard, 2, "O");
                app.squares = testBoard;
                app.computerMove();
                expect(app.squares)
                    .withContext("Computer let the human win")
                    .toEqual(expectedBoard);
            });
        });
        it("should have the computer prioritize winning over blocking", () => {
            const testBoard: Board = ["X", "", "X", "", "", "", "O", "O", ""];
            const expectedBoard: Board = updateTuple(testBoard, 8, "O");
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

function updateByLine(initialBoard: Board, spec: LineSpec, line: Line): Board {
    return [0, 1, 2].reduce((board, pos, index) => {
        const [y, x] = coordsByLine(spec, pos);
        return updateTuple(board, y * 3 + x, line[index]);
    }, initialBoard);
}

describe("updateTuple", () => {
    it("returns modified tuple", () => {
        const testTuple: Line = ["X", "", "X"];
        const expectedTuple: Line = ["X", "O", "X"];
        const newTuple = updateTuple(testTuple, 1, "O");
        expect(newTuple).toEqual(expectedTuple);
    });
    it("does not modify original tuple", () => {
        const testTuple: Line = ["X", "", "X"];
        const newTuple = updateTuple(testTuple, 1, "O");
        expect(newTuple).not.toEqual(testTuple);
    });
});
function updateTuple<T extends [...T], K extends keyof [...T], V extends [...T][K]>(
    tuple: [...T],
    index: K,
    value: V
) {
    let [...newTuple] = tuple;
    newTuple[index] = value;
    return newTuple;
}
