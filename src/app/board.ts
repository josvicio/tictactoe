import { updateTuple } from "./util";

export type BoardSymbol = "" | "X" | "O";
type LineCoordSpec = [factor: number, offset: number];
export type LineData = [BoardSymbol, BoardSymbol, BoardSymbol];

const TRANSFORM_POSITIONS: [number, number, number] = [-1, 0, 1];
export class Line {
    constructor(readonly row: LineCoordSpec, readonly column: LineCoordSpec) {}

    transformCoords(pos: number): [row: number, column: number] {
        return [transformCoord(this.column, pos), transformCoord(this.row, pos)];
    }
    transformIndex(pos: number): number {
        return transformCoord(this.column, pos) * 3 + transformCoord(this.row, pos);
    }
    get indices(): [number, number, number] {
        return [this.transformIndex(0), this.transformIndex(1), this.transformIndex(2)];
    }
}
export namespace Line {
    export const DIAGONAL = new Line([1, 1], [1, 1]);
}
export const Lines: { [name: string]: Line } = {
    TOP: new Line([1, 1], [0, 0]),
    MIDDLE: new Line([1, 1], [0, 1]),
    BOTTOM: new Line([1, 1], [0, 2]),
    LEFT: new Line([0, 0], [1, 1]),
    CENTER: new Line([0, 1], [1, 1]),
    RIGHT: new Line([0, 2], [1, 1]),
    DIAGONAL: new Line([1, 1], [1, 1]),
    ANTIDIAGONAL: new Line([1, 1], [-1, 1])
};

function transformCoord([factor, offset]: LineCoordSpec, pos: number): number {
    return TRANSFORM_POSITIONS[pos] * factor + offset;
}
export type BoardData = [
    BoardSymbol,
    BoardSymbol,
    BoardSymbol,
    BoardSymbol,
    BoardSymbol,
    BoardSymbol,
    BoardSymbol,
    BoardSymbol,
    BoardSymbol
];
const BLANK_BOARD_DATA: BoardData = ["", "", "", "", "", "", "", "", ""];
export class Board {
    constructor(public readonly boardData: BoardData = BLANK_BOARD_DATA) {}
    getSquare(row: number, column: number) {
        return this.boardData[coordsToIndex(row, column)];
    }
    withSquareAtIndex(index: number, symbol: BoardSymbol) {
        return new Board(updateTuple(this.boardData, index, symbol));
    }
    withSquareAtCoords(row: number, column: number, symbol: BoardSymbol) {
        return this.withSquareAtIndex(coordsToIndex(row, column), symbol);
    }
    getLineData(line: Line): LineData {
        return [
            this.getSquare(...line.transformCoords(0)),
            this.getSquare(...line.transformCoords(1)),
            this.getSquare(...line.transformCoords(2))
        ];
    }
    withSquareAtLinePos(line: Line, pos: number, symbol: BoardSymbol): Board {
        return this.withSquareAtIndex(line.transformIndex(pos), symbol);
    }
    withLine(line: Line, symbols: LineData): Board {
        return symbols.reduce((board, symbol, pos) => {
            return board.withSquareAtLinePos(line, pos, symbol);
        }, this as Board);
    }
}

function coordsToIndex(row: number, column: number): number {
    return row * 3 + column;
}
