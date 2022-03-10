import { Component } from "@angular/core";
import { LineData, BoardSymbol as BoardSymbol, BoardData, Board } from "./board";

type LineFactorNumber = -1 | 0 | 1;
type LineOffsetNumber = 0 | 1 | 2;
export interface LineSpec {
    offset: { x: LineOffsetNumber; y: LineOffsetNumber };
    factor: { x: LineFactorNumber; y: LineFactorNumber };
}

export const LineSpecs: { [key: string]: LineSpec } = {
    DIAGONAL: {
        offset: { x: 1, y: 1 },
        factor: { x: -1, y: 1 }
    },
    ANTIDIAGONAL: {
        offset: { x: 1, y: 1 },
        factor: { x: 1, y: 1 }
    },
    TOP: {
        offset: { x: 1, y: 0 },
        factor: { x: 1, y: 0 }
    },
    MIDDLE: {
        offset: { x: 1, y: 1 },
        factor: { x: 1, y: 0 }
    },
    BOTTOM: {
        offset: { x: 1, y: 2 },
        factor: { x: 1, y: 0 }
    },
    LEFT: {
        offset: { x: 0, y: 1 },
        factor: { x: 0, y: 1 }
    },
    CENTER: {
        offset: { x: 1, y: 1 },
        factor: { x: 0, y: 1 }
    },
    RIGHT: {
        offset: { x: 2, y: 1 },
        factor: { x: 0, y: 1 }
    }
} as const;

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.sass"]
})
export class AppComponent {
    squares: BoardData = ["", "", "", "", "", "", "", "", ""];
    board: Board = new Board(this.squares);
    getSquare(row: number, column: number) {
        return this.squares[row * 3 + column];
    }
    setSquare(row: number, column: number, symbol: BoardSymbol) {
        this.squares[row * 3 + column] = symbol;
    }
    humanMove(row: number, column: number) {
        if (this.getSquare(row, column) == "") {
            this.setSquare(row, column, "X");
            this.computerMove();
        }
    }
    computerMove() {
        for (const symbol of ["O", "X"]) {
            for (const type in LineSpecs) {
                const lineSpec = LineSpecs[type];
                const diagonal = this.getLine(lineSpec);
                if (almostComplete(symbol, diagonal)) {
                    const pos = diagonal.findIndex(s => s == "");
                    if (pos >= 0) {
                        this.setSquare(...coordsByLine(lineSpec, pos), "O");
                        return;
                    }
                }
            }
        }
        this.defaultMove();
    }
    getLine(spec: LineSpec): LineData {
        return [
            this.getSquare(...coordsByLine(spec, 0)),
            this.getSquare(...coordsByLine(spec, 1)),
            this.getSquare(...coordsByLine(spec, 2))
        ];
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
export function coordsByLine(spec: LineSpec, pos: number): [y: number, x: number] {
    const transformPos = [-1, 0, 1][pos];
    return [
        transformPos * spec.factor.y + spec.offset.y,
        transformPos * spec.factor.x + spec.offset.x
    ];
}
function almostComplete(symbol: string, line: LineData): Boolean {
    return line.filter(s => s == symbol).length == line.length - 1;
}
function updateTuple<T extends [...T], K extends keyof [...T], V extends [...T][K]>(
    tuple: [...T],
    index: K,
    value: V
) {
    let [...newTuple] = tuple;
    newTuple[index] = value;
    return newTuple;
}
