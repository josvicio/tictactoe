import { Board, BoardSymbol, LineData, Lines } from "./board";
import { updateTuple } from "./util";

export class Game {
    #board: Board;
    constructor(board: Board = new Board()) {
        this.#board = board;
    }
    get board(): Board {
        return this.#board;
    }
    humanMove(row: number, column: number) {
        if (this.board.getSquare(row, column) == "") {
            this.updateBoard(board => {
                return board.withSquareAtCoords(row, column, "X");
            });
            this.computerMove();
        }
    }
    computerMove() {
        for (const symbol of ["O", "X"] as ["O", "X"]) {
            for (const line in Lines) {
                var lineData = this.#board.getLineData(Lines[line]);
                if (almostComplete(symbol, lineData)) {
                    const missingIndex = lineData.findIndex(symbol => symbol == "");
                    if (missingIndex >= 0) {
                        this.updateBoard(board =>
                            board.withLine(Lines[line], updateTuple(lineData, missingIndex, "O"))
                        );
                        return;
                    }
                }
            }
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
