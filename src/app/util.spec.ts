import { Line, LineData } from "./board";
import { updateTuple } from "./util";

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
