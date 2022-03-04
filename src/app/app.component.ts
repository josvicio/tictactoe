import { Component } from "@angular/core";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.sass"]
})
export class AppComponent {
    squares = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    humanMove(row: number, column: number) {
        this.squares[row][column] = "X";
        this.computerMove();
    }
    computerMove() {
        for (const row in this.squares) {
            for (const column in this.squares[row]) {
                if (this.squares[row][column] == "") {
                    this.squares[row][column] = "O";
                    return;
                }
            }
        }
    }
}
