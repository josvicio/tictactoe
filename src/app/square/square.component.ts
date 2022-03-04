import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "square",
    templateUrl: "./square.component.html",
    styleUrls: ["./square.component.sass"]
})
export class SquareComponent implements OnInit {
    @Input() symbol: string = "";

    constructor() {}

    ngOnInit(): void {}
}
