export function updateTuple<T extends [...T], K extends keyof T>(
    tuple: readonly [...T],
    index: K,
    value: T[K]
): T {
    let [...newTuple] = tuple;
    newTuple[index] = value;
    return newTuple;
}
export function coordsToIndex(row: number, column: number): number {
    return row * 3 + column;
}
