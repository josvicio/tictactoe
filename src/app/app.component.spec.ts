import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent, Board, Row, updateElement } from "./app.component";
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
                    expect(app.squares[row][column]).toBe("X");
                });
                it(`should show the following computer move in a different square`, () => {
                    app.humanMove(row, column);
                    fixture.detectChanges();
                    expect(app.squares.flat(1)).toContain("X");
                    expect(app.squares.flat(1)).toContain("O");
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
        for (const symbol of ["X", "O"]) {
            it(`should disallow human plays on an existing ${symbol} square`, () => {
                const testSquares: Board = [
                    [symbol, "", ""],
                    ["", "", ""],
                    ["", "", ""]
                ];
                app.squares = testSquares;
                app.humanMove(0, 0);
                expect(app.squares[0][0]).toEqual(symbol);
                expect(app.squares).withContext("Board was modified").toEqual(testSquares);
            });
        }
        describe("should have the computer win as soon as possible", () => {
            ["top", "middle", "bottom"].forEach((rowName, rowIndex) => {
                describe(`in the ${rowName} row`, () => {
                    ["first", "second", "third"].forEach((posOrdinal, posIndex) => {
                        it(`with the ${posOrdinal} square missing`, () => {
                            const initialBoard: Board = [
                                ["", "", ""],
                                ["", "", ""],
                                ["", "", ""]
                            ];
                            const expectedTestRow = ["O", "O", "O"] as Row;
                            const initialTestRow = updateElement(expectedTestRow, posIndex, "");
                            const testSquares: Board = updateElement(
                                initialBoard,
                                rowIndex,
                                initialTestRow
                            );
                            const expectedSquares: Board = updateElement(
                                initialBoard,
                                rowIndex,
                                expectedTestRow
                            );
                            app.squares = testSquares;
                            app.computerMove();
                            console.log(app.squares);
                            expect(app.squares)
                                .withContext("Computer did not win")
                                .toEqual(expectedSquares);
                        });
                    });
                });
            });
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
