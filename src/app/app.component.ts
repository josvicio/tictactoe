import { Component } from "@angular/core";

export type Row = [string, string, string];
export type Board = [Row, Row, Row];

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.sass"]
})
export class AppComponent {
    squares: Board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    public getRow(index: number): Row {
        return this.squares[index];
    }

    humanMove(row: number, column: number) {
        if (this.squares[row][column] == "") {
            this.squares[row][column] = "X";
            this.computerMove();
        }
    }
    computerMove() {
        for (const row in this.squares) {
            if (almostComplete("O", this.squares[row])) {
                const col = this.squares[row].findIndex(s => s == "");
                if (col >= 0) {
                    this.setSymbol(Number(row), col, "O");
                    return;
                }
            }
        }
        this.defaultMove();
    }
    defaultMove() {
        for (const row in this.squares) {
            for (const column in this.squares[row]) {
                if (this.squares[row][column] == "") {
                    // this.squares[row][column] = "O";
                    this.squares[row] = updateElement(this.squares[row], Number(column), "O");
                    return;
                }
            }
        }
    }
    setSymbol(row: number, column: number, value: string) {
        this.squares = updateElement(
            this.squares,
            row,
            updateElement(this.squares[row], column, value)
        );
    }
}
function almostComplete(symbol: string, row: Row): Boolean {
    return row.filter(s => s == symbol).length == row.length - 1;
}

export function updateElement<E, T extends E[]>(tuple: T, index: number, value: E): T {
    let newTuple: [...T] = [...tuple];
    newTuple[index] = value;
    return newTuple;
}
