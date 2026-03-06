export async function resolvePromisesOfObject<O extends Record<any, any>>(
    object: O
): Promise<{ [K in keyof O]: Awaited<O[K]>; }> {
    const keys: (keyof O)[] = Object.keys(object);
    const values: Promise<(O[keyof O])[]> = Promise.all(Object.values(object));
    return await values.then(p => Object.fromEntries(keys.map(
        (k, i) => [ k, p[i] as O[typeof k] ]
    ))) as { [K in keyof O]: Awaited<O[K]>; };
}
