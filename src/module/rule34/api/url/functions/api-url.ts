import { BASE_URL } from "../constants/base-url.ts";
import { createURL } from "../../../../../util/misc/functions/create-url.ts";
import type { ApiUrlParameterMap } from "../interfaces/api-parameter-map.ts";

let getURL = (
    s: string,
    params: NonNullable<Parameters<typeof createURL>[0]["params"]>
) => createURL({
    base: BASE_URL,
    params: {
        page: "dapi",
        q: "index",
        s: s,
        ...params
    }
});

export function apiUrl<S extends keyof ApiUrlParameterMap>(
    s: S,
    params: ApiUrlParameterMap[S]["params"],
    ...args: ApiUrlParameterMap[S]["args"]
): string;
export function apiUrl<S extends "post">(
    s: S,
    params: Omit<ApiUrlParameterMap[S]["params"], "json">,
    bothFormats: true
): { json: string; xml: string; };

export function apiUrl<S extends keyof ApiUrlParameterMap>(
    s: S,
    params: ApiUrlParameterMap[S]["params"],
    ...args: ApiUrlParameterMap[S]["args"]
) {
    switch (s) {
        case "autocomplete": return createURL({
            base: BASE_URL,
            path: [ "autocomplete.php" ],
            params: params
        });
        case "post": if (args[0]) return {
            xml:  getURL(s, { ...params, json: 0 }),
            json: getURL(s, { ...params, json: 1 })
        };
        case "comment":
        default:
            return getURL(s, params);
    }
}
