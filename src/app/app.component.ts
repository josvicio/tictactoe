import { Component } from "@angular/core";
import { LineData, BoardSymbol as BoardSymbol, Board, Lines, Line } from "./board";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.sass"]
})
export class AppComponent {
    board: Board = new Board();
    getSquare(row: number, column: number) {
        return this.board.getSquare(row, column);
    }
    setSquare(row: number, column: number, symbol: BoardSymbol) {
        this.board = this.board.withSquareAtCoords(row, column, symbol);
    }
    setLine(line: Line, lineData: LineData) {
        this.board = this.board.withLine(line, lineData);
    }
    humanMove(row: number, column: number) {
        if (this.getSquare(row, column) == "") {
            this.setSquare(row, column, "X");
            this.computerMove();
        }
    }
    computerMove() {
        for (const symbol of ["O", "X"] as ["O", "X"]) {
            for (const type in Lines) {
                const line = Lines[type];
                const diagonal = this.board.getLineData(line);
                if (almostComplete(symbol, diagonal)) {
                    const pos = diagonal.findIndex(s => s == "");
                    if (pos >= 0) {
                        this.board = this.board.withSquareAtLinePos(line, pos, "O");
                        return;
                    }
                }
            }
        }
        this.defaultMove();
    }
    getLine(line: Line): LineData {
        return this.board.getLineData(line);
    }
    defaultMove() {
        for (const row of [0, 1, 2]) {
            for (const column of [0, 1, 2]) {
                if (this.getSquare(row, column) == "") {
                    this.setSquare(row, column, "O");
                    return;
                }
            }
        }
    }
}

function almostComplete(symbol: BoardSymbol, line: LineData): Boolean {
    return line.filter(s => s == symbol).length == line.length - 1;
}
