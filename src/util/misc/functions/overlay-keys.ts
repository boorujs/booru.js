export function overlayKeys<
    O extends unknown,
    N extends unknown
>(
    object: O,
    overlay: N
): { [K in Exclude<keyof O, keyof N>]: O[K] } & N
{
    Object.entries(overlay).forEach(([ key, value ]) =>
        object[key] = value
    );
    return object;
}
