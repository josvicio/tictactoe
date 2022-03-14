import { Board, Line, Lines } from "./board";

describe("Line", () => {
    it("should correctly calculate indices", () => {
        const line = new Line([1, 1], [1, 1]);
        const expectedIndices = [0, 4, 8];
        expect(line.indices).toEqual(expectedIndices);
    });
});

describe("Board", () => {
    it("should correctly return a copy with one square changed", () => {
        const initialBoard = new Board();
        const testBoard = initialBoard.withSquareAtCoords(1, 2, "O");
        expect(testBoard).not.toEqual(initialBoard);
        expect(testBoard.boardData).toEqual(["", "", "", "", "", "O", "", "", ""]);
    });
    it("should correctly return a copy with an entire line changed", () => {
        const initialBoard = new Board();
        const testBoard = initialBoard.withLine(Lines["DIAGONAL"], ["O", "X", "O"]);
        expect(testBoard).not.toEqual(initialBoard);
        expect(testBoard.boardData).toEqual(["O", "", "", "", "X", "", "", "", "O"]);
    });
});
