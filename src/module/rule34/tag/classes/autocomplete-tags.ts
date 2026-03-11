import { AutocompleteTag } from "./autocomplete-tag.ts";
import type { RawAutocompleteTags } from "../../api/raw/interface/raw-autocomplete-tag.ts";

/** Tags received as autocomplete suggestions. */
export class AutocompleteTags {
    /** Single incomplete tag to be autocompleted. */
    incompleteTag: string | null;
    /** Resulting autocomplete suggestions. */
    tags: AutocompleteTag[];
    
    constructor (array: AutocompleteTag[], tag: string) {
        this.tags = array.slice(
            0,
            array.findIndex(i => !i.isReal()) + 1
        );
        this.incompleteTag = tag;
    }

    static fromRaw(raw: RawAutocompleteTags, tag: string): AutocompleteTags {
        return new this(
            raw.map(i => AutocompleteTag.fromRaw(i)),
            tag
        );
    }
}
