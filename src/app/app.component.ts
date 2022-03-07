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

    humanMove(row: number, column: number) {
        if (this.squares[row][column] == "") {
            this.squares[row][column] = "X";
            this.computerMove();
        }
    }
    computerMove() {
        for (const row in [0, 1, 2]) {
            if (almostComplete("O", this.squares[row])) {
                const col = this.squares[row].findIndex(s => s == "");
                if (col >= 0) {
                    this.squares[row][col] = "O";
                    return;
                }
            }
        }
        for (const colIndex in [0, 1, 2]) {
            const column = this.getColumn(Number(colIndex));
            if (almostComplete("O", column)) {
                const pos = column.findIndex(s => s == "");
                if (pos >= 0) {
                    this.squares[pos][colIndex] = "O";
                    return;
                }
            }
        }
        this.defaultMove();
    }
    getColumn(colIndex: number): Row {
        return [this.squares[0][colIndex], this.squares[1][colIndex], this.squares[2][colIndex]];
    }
    defaultMove() {
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
function almostComplete(symbol: string, row: Row): Boolean {
    return row.filter(s => s == symbol).length == row.length - 1;
}

export function updateElement<E, T extends E[]>(tuple: T, index: number, value: E): T {
    let newTuple: [...T] = [...tuple];
    newTuple[index] = value;
    return newTuple;
}
