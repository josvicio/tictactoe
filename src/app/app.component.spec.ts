import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { SquareComponent } from "./square/square.component";

describe("AppComponent", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent, SquareComponent]
        }).compileComponents();
    });
    it("should render gameboard", () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelectorAll(".gameboard .square")?.length)
            .withContext("Not the right amount of squares on the gameboard")
            .toEqual(9);
    });
    it("should show an x in a square when it's clicked", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const square = fixture.debugElement.query(By.css(".square"));
        (square.nativeElement as HTMLElement).click();
        fixture.detectChanges();
        const compiled = square.nativeElement as HTMLElement;
        expect(compiled.textContent).toEqual("X");
    });
});
