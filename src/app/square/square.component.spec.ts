import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

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
        expect(fixture.nativeElement.textContent).toEqual("");
    });
});
