import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { SquareComponent } from "./square/square.component";

describe("Game board", () => {
    let fixture: ComponentFixture<AppComponent>;
    let app: AppComponent;
    let debugElement: DebugElement;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent, SquareComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        app = fixture.componentInstance;
        debugElement = fixture.debugElement;
    });
    it("Should render gameboard", () => {
        expect(debugElement.queryAll(By.css("[data-test=square]")).length).toBe(9);
    });
    it("should handle keypresses", () => {
        app.handleKey(new KeyboardEvent("keypress", { key: "3" }));
        expect(app.game.board.boardData[2])
            .withContext("X wasn't placed in the expected position")
            .toEqual("X");
        expect(app.game.board.boardData.filter(symbol => symbol == "X").length)
            .withContext("More than one X on the board")
            .toEqual(1);
    });
});
