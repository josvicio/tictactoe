import { Component } from "@angular/core";

export type Symbol = "" | "X" | "O";
export type Line = [Symbol, Symbol, Symbol];
export type Board = [Line, Line, Line];

type LineFactorNumber = -1 | 0 | 1;
type LineOffsetNumber = 0 | 1 | 2;
interface LineSpec {
    offset: { x: LineOffsetNumber; y: LineOffsetNumber };
    factor: { x: LineFactorNumber; y: LineFactorNumber };
}

const LineSpecs: { [key: string]: LineSpec } = {
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
        for (const symbol of ["O", "X"]) {
            for (const type in LineSpecs) {
                const lineSpec = LineSpecs[type];
                const diagonal = this.getLine(lineSpec);
                if (almostComplete(symbol, diagonal)) {
                    const pos = diagonal.findIndex(s => s == "");
                    if (pos >= 0) {
                        const { factor, offset } = lineSpec;
                        const newY = (pos - 1) * factor.y + offset.y;
                        const newX = (pos - 1) * factor.x + offset.x;
                        this.squares[newY][newX] = "O";
                        return;
                    }
                }
            }
        }
        this.defaultMove();
    }
    getLine(spec: LineSpec): Line {
        return [
            this.squares[-1 * spec.factor.y + spec.offset.y][-1 * spec.factor.x + spec.offset.x],
            this.squares[0 * spec.factor.y + spec.offset.y][0 * spec.factor.x + spec.offset.x],
            this.squares[1 * spec.factor.y + spec.offset.y][1 * spec.factor.x + spec.offset.x]
        ];
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
function almostComplete(symbol: string, line: Line): Boolean {
    return line.filter(s => s == symbol).length == line.length - 1;
}

export function updateElement<E, T extends E[]>(tuple: T, index: number, value: E): T {
    let newTuple: [...T] = [...tuple];
    newTuple[index] = value;
    return newTuple;
}
