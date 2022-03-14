import { LineData } from "./board";
import { coordsToIndex, updateTuple } from "./util";

describe("updateTuple", () => {
    it("returns modified tuple", () => {
        const testTuple: LineData = ["X", "", "X"];
        const expectedTuple: LineData = ["X", "O", "X"];
        const newTuple = updateTuple(testTuple, 1, "O");
        expect(newTuple).toEqual(expectedTuple);
    });
    it("does not modify original tuple", () => {
        const testTuple: LineData = ["X", "", "X"];
        const newTuple = updateTuple(testTuple, 1, "O");
        expect(newTuple).not.toEqual(testTuple);
    });
});
describe("coordsToIndex", () => {
    it("correctly calculates index from coords", () => {
        expect(coordsToIndex(1, 2)).toEqual(5);
    });
});
