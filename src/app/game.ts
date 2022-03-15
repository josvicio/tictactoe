import { Board, BoardSymbol, LineData, Lines } from "./board";
import { coordsToIndex, updateTuple } from "./util";

export class Game {
    #board: Board;
    constructor(board: Board = new Board()) {
        this.#board = board;
    }
    get board(): Board {
        return this.#board;
    }

    humanMoveByIndex(index: number) {
        if (this.board.boardData[index] == "") {
            this.updateBoard(board => {
                return board.withSquareAtIndex(index, "X");
            });
            this.computerMove();
        }
    }
    humanMove(row: number, column: number) {
        this.humanMoveByIndex(coordsToIndex(row, column));
    }
    computerMove() {
        for (const symbol of ["O", "X"] as ["O", "X"]) {
            for (const line of Object.values(Lines)) {
                var lineData = this.#board.getLineData(line);
                if (almostComplete(symbol, lineData)) {
                    const missingIndex = lineData.findIndex(symbol => symbol == "");
                    if (missingIndex >= 0) {
                        this.updateBoard(board =>
                            board.withLine(line, updateTuple(lineData, missingIndex, "O"))
                        );
                        return;
                    }
                }
            }
        }
        if (this.#board.boardData[4] == "") {
            this.updateBoard(board => board.withSquareAtIndex(4, "O"));
            return;
        }
        this.defaultComputerMove();
    }
    defaultComputerMove() {
        for (const i of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
            if (this.#board.boardData[i] == "") {
                this.updateBoard(board => board.withSquareAtIndex(Number(i), "O"));
                return;
            }
        }
    }
    private updateBoard(transform: (board: Board) => Board) {
        this.#board = transform(this.#board);
    }
}

function almostComplete(symbol: BoardSymbol, line: LineData): Boolean {
    return line.filter(s => s == symbol).length == line.length - 1;
}
