import { TagType } from "../enums/tag-type.ts";
import type { TagWithType } from "./tag-with-type.ts";
import type { RawPostJson } from "../../api/raw/interface/raw-posts-json.ts";

/** A tag with a type found under a post. */
export class PostTagTyped extends TagWithType {
    name: string;
    count: number;
    type: TagType;

    toJSON() {
        return {
            name: this.name,
            count: this.count,
            type: this.type
        };
    }
    
    static RAW_TAG_TYPE = {
        "copyright": "Copyright",
        "character": "Character",
        "artist": "Artist",
        "tag": "General",
        "metadata": "Metadata",
        [null]: "Ambiguous"
    } satisfies {
        [K in any]: keyof typeof TagType;
    };
    
    constructor (object: {
        name: string;
        count: number;
        type: TagType;
    }) {
        this.name = object.name;
        this.count = object.count;
        this.type = object.type;
    }

    static fromRaw(raw: RawPostJson<true>["tag_info"][number]) {
        return new this({
            name: raw.tag,
            count: raw.count,
            type: TagType[this.RAW_TAG_TYPE[raw.type]]
        });
    }
}
