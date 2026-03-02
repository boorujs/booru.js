import { createURL } from "../../../../../util/misc/functions/create-url.ts";
import * as APIParameters from "../types/api-parameters.ts";
import type { Authentication } from "../../../client/interfaces/authentication.ts";

let getURL = (
    s: string,
    params: NonNullable<Parameters<typeof createURL>[0]["params"]>,
    auth: Authentication
) => createURL({
    base: "https://api.rule34.xxx/",
    params: {
        page: "dapi",
        q: "index",
        s: s,
        ...params,
        ...auth
    }
});

export function autocomplete(
    params: APIParameters.Autocomplete
): string {
    return createURL({
        base: "https://api.rule34.xxx/",
        path: [ "autocomplete.php" ],
        params: params
    });
}

export function post(
    auth: Authentication,
    params: APIParameters.Search
): string {
    return getURL("post", params, auth);
}

export function postBothFormats(
    auth: Authentication,
    params: Omit<APIParameters.Search<true>, "json">
): { xml: string; json: string; } {
    // @
    const xml: any = params;
    xml.json = 0;
    delete xml.fields;

    const json: any = params;
    json.json = 1;

    return {
        xml: post(auth, xml),
        json: post(auth, json)
    };
}
