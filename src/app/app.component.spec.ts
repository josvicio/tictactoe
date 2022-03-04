import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { SquareComponent } from "./square/square.component";

describe("Game board", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent, SquareComponent]
        }).compileComponents();
    });
    describe("First turn", () => {
        forAllSquares((row, column) => {
            describe(`Human moves at (${column}, ${row})`, () => {
                it(`should show the human move on that square`, () => {
                    const fixture = TestBed.createComponent(AppComponent);
                    fixture.detectChanges();
                    const app = fixture.componentInstance;
                    app.humanMove(row, column);
                    expect(app.squares[row][column]).toBe("X");
                });
                it(`should show the following computer move in a different square`, () => {
                    const fixture = TestBed.createComponent(AppComponent);
                    fixture.detectChanges();
                    const app = fixture.componentInstance;
                    app.humanMove(row, column);
                    fixture.detectChanges();
                    expect(app.squares.flat(1)).toContain("X");
                    expect(app.squares.flat(1)).toContain("O");
                });
            });
        });
        it("should show the computer move", () => {
            const fixture = TestBed.createComponent(AppComponent);
            fixture.detectChanges();
            fixture.componentInstance.computerMove();
            fixture.detectChanges();
            expect(fixture.componentInstance.squares.flat(1)).toContain("O");
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
