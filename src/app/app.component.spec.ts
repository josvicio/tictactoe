import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { SquareComponent } from "./square/square.component";

describe("App", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent, SquareComponent]
        }).compileComponents();
    });
    it("should render gameboard", () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement;
        expect(compiled.queryAll(By.css("[data-test=square]")).length)
            .withContext("Not the right amount of squares on the gameboard")
            .toEqual(9);
    });
});
