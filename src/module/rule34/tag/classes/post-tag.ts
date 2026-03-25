import { TagType } from "../enums/tag-type.ts";
import type { BaseTag } from "../interfaces/base-tag.ts";
import type { RawPostJson } from "../../api/raw/interface/raw-posts-json.ts";

/** A tag attributed to a post. */
export class PostTag<T extends TagType = TagType> extends BaseTag<T> {
    name: string;
    count: number;
    type: T;
    
    static RAW_TAG_TYPE = {
        "copyright": "Copyright",
        "character": "Character",
        "artist": "Artist",
        "tag": "General",
        "metadata": "Metadata",
        [null as any as "null"]: "Ambiguous"
    } satisfies {
        [K in Exclude<
            RawPostJson<true>["tag_info"][number]["type"],
            null
        > | "null"]:
            keyof typeof TagType;
    };
    
    constructor (object: {
        name: string;
        count: number;
        type: T;
    }) {
        this.name = object.name;
        this.count = object.count;
        this.type = object.type;
    }

    static fromRaw(raw: RawPostJson<true>["tag_info"][number]) {
        return new this({
            name: raw.tag,
            count: raw.count,
            type: TagType[this.RAW_TAG_TYPE[
                raw.type as keyof typeof this.RAW_TAG_TYPE
            ]]
        });
    }
}
