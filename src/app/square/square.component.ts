import { Component, OnInit } from "@angular/core";

@Component({
    selector: "square",
    templateUrl: "./square.component.html",
    styleUrls: ["./square.component.sass"]
})
export class SquareComponent implements OnInit {
    symbol: string = "";
    clicked() {
        this.symbol = "X";
    }

    constructor() {}

    ngOnInit(): void {}
}
