export function updateTuple<T extends [...T], K extends keyof T, V extends T[K]>(
    tuple: [...T],
    index: K,
    value: V
): T {
    let [...newTuple] = tuple;
    newTuple[index] = value;
    return newTuple;
}
