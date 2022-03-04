import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
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
        it("should disallow human plays on an existing X square", () => {
            app.humanMove(0, 0);
            app.humanMove(0, 0);
            expect(fixture.componentInstance.squares.flat(1).filter(s => s == "O").length)
                .withContext("Wrong number of computer moves")
                .toEqual(1);
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
