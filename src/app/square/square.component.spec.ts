import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SquareComponent } from "./square.component";

describe("SquareComponent", () => {
    let component: SquareComponent;
    let fixture: ComponentFixture<SquareComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SquareComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SquareComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it("should show nothing initially", () => {
        expect(component.symbol).withContext("symbol should be blank").toEqual("");
        const element = fixture.nativeElement as HTMLElement;
        expect(element.textContent).toEqual("");
    });
    it("should show an X when clicked", () => {
        (
            (fixture.nativeElement as HTMLElement).querySelector(".square") as HTMLElement | null
        )?.click();
        fixture.detectChanges();
        expect(component.symbol).withContext("symbol is incorrect").toEqual("X");
        const element = fixture.nativeElement as HTMLElement;
        expect(element.textContent).toEqual("X");
    });
});
