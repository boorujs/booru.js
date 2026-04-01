import type { TagKeysMap } from "../interfaces/tag-keys-map.ts";

export type TagKeysPick<T extends (keyof TagKeysMap)[]> =
    T extends [
        infer F extends keyof TagKeysMap,
        ...infer R extends (keyof TagKeysMap)[]
    ]
        ? TagKeysMap[F] & TagKeysPick<R>
        : unknown;
