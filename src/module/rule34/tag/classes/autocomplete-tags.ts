import { AutocompleteTag } from "./autocomplete-tag.ts";
import { fetchJSON } from "../../../../util/rest.ts";
import * as APIURL from "../../api/url/functions/api-url.ts";
import type { RawAutocompleteTags } from "../../api/raw/interface/raw-autocomplete-tag.ts";

/** Tags received as autocomplete suggestions. */
export class AutocompleteTags {
    static LAST_TAG_REGEX = /(?<= ?)[^ ]+$/;

    /** Single incomplete tag to be autocompleted. */
    incompleteTag: string | null;
    /** Resulting autocomplete suggestions. */
    tags: AutocompleteTag[];

    //#region constructor
    static async fromQuery(query: string): Promise<
        ReturnType<typeof this.fromRaw>
    > {
        const tag = query.match(this.LAST_TAG_REGEX)?.[0];
        if (!tag) return this.fromRaw([], query);
        const response: RawAutocompleteTags
            = await fetchJSON(APIURL.autocomplete({ q: tag }));
        return this.fromRaw(response, tag);
    }

    static fromRaw(raw: RawAutocompleteTags, tag: string): AutocompleteTags {
        return this.fromObject(raw.map(AutocompleteTag.fromRaw), tag);
    }

    static fromObject(object: AutocompleteTag[], tag: string) {
        return new this(object, tag);
    }
    
    constructor (array: AutocompleteTag[], tag: string) {
        this.incompleteTag = tag;
        this.tags = array.filter(i => i.isReal());
    }
    //#endregion
}
