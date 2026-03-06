import { overlayKeys } from "../../../../util/object/functions/overlay-keys.ts";
import type { BaseTag } from "../interfaces/base-tag.ts";
import type { RawAutocompleteTags } from "../../api/raw/interface/raw-autocomplete-tag.ts";

/** A tag received from an autocomplete suggestion. */
export class AutocompleteTag implements Pick<BaseTag, "name" | "count"> {
    protected raw: RawAutocompleteTags[number];

    name!: string;
    count!: number;

    isReal(): boolean {
        return !AutocompleteTag.RAW_INVALID_REGEX.test(this.raw.value);
    }

    static RAW_INVALID_REGEX = /\\r\\n/;
    static RAW_LABEL_COUNT_REGEX = /(?<=\()\d+(?=\)$)/;

    constructor (
        object: { name: string; count: number; },
        raw: RawAutocompleteTags[number]
    ) {
        overlayKeys(this, object);
        this.raw = raw;
    }

    static fromRaw(raw: RawAutocompleteTags[number]) {
        return new this({
            name: raw.value,
            count: parseInt(
                raw.label.match(this.RAW_LABEL_COUNT_REGEX)?.[0] ?? "0"
            )
        }, raw);
    }
}
