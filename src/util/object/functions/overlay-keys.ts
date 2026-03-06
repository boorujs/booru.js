export function overlayKeys<
    O extends Record<keyof any, any>,
    N extends Record<keyof any, any>
>(
    object: O,
    overlay: N
): { [K in Exclude<keyof O, keyof N>]: O[K] } & N
{
    Object.entries(overlay).forEach(
        ([ key, value ]: [ keyof N, N[keyof N] ]) => object[key] = value
    );
    return object;
}
