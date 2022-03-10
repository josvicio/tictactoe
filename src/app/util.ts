export function updateTuple<T extends [...T], K extends keyof T>(
    tuple: [...T],
    index: K,
    value: T[K]
): T {
    let [...newTuple] = tuple;
    newTuple[index] = value;
    return newTuple;
}
