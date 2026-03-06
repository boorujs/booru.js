import { TagType } from "../enums/tag-type.ts";
import { overlayKeys } from "../../../../util/object/functions/overlay-keys.ts";
import type { BaseTag } from "../interfaces/base-tag.ts";
import type { RawPostJSON } from "../../api/raw/interface/raw-posts-json.ts";

/** A tag attributed to  a post. */
export class PostTag<T extends TagType = TagType>
implements Pick<BaseTag<T>, "name" | "count" | "type"> {
    name!: string;
    count!: number;
    type!: T;
    
    static RAW_TAG_TYPE = {
        "copyright": "Copyright",
        "character": "Character",
        "artist": "Artist",
        "tag": "General",
        "metadata": "Metadata",
        [null as any as "null"]: "Ambiguous"
    } satisfies {
        [K in Exclude<
            RawPostJSON<true>["tag_info"][number]["type"],
            null
        > | "null"]:
            keyof typeof TagType;
    };
    
    constructor (object: {
        name: string;
        count: number;
        type: T;
    }) {
        overlayKeys(this, object);
    }

    static fromRaw(raw: RawPostJSON<true>["tag_info"][number]) {
        return new this({
            name: raw.tag,
            count: raw.count,
            type: TagType[this.RAW_TAG_TYPE[
                raw.type as keyof typeof this.RAW_TAG_TYPE
            ]]
            // ERROR
        });
    }
}
