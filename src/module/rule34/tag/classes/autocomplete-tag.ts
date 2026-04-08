import type { TagKeysPick } from "../types/tag-keys-pick.ts";
import type { RawAutocompleteTags } from "../../api/raw/interface/raw-autocomplete-tag.ts";

/** A tag received from an autocomplete suggestion. */
export class AutocompleteTag implements TagKeysPick<["name", "count"]> {
    name: string;
    count: number;

    constructor (object: {
        name: string;
        count: number;
    }) {
        this.name = object.name;
        this.count = object.count;
    }

    static RAW_COUNT_REGEX = /(?<=\()\d+(?=\)$)/;

    static fromRaw(raw: RawAutocompleteTags[number]) {
        return new this({
            name: raw.value,
            count: parseInt(
                raw.label.match(this.RAW_COUNT_REGEX)?.[0] ?? "0"
            )
        });
    }
}
