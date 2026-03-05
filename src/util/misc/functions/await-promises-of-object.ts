export async function awaitPromisesOfObject<T extends Promise<any>>(
    object: Record<keyof any, T>
): Promise<Record<keyof typeof object, Awaited<T>>> {
    const keys = Object.keys(object);
    return await <Promise<Record<keyof typeof object, Awaited<T>>>>
        Promise.all(Object.values(object))
        .then(p => Object.fromEntries(keys.map((k, i) => [ k, p[i] ])));
}
