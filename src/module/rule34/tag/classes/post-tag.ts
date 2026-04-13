import { TagType } from "../enums/tag-type.ts";
import type { BaseTag } from "./base-tag.ts";
import type { RawPostJson } from "../../api/raw/interface/raw-posts-json.ts";

/** A tag attributed to a post. */
export class PostTag extends BaseTag {
    name: string;
    count: number;

    toJSON() {
        return {
            name: this.name,
            count: this.count
        };
    }
    
    constructor (object: {
        name: string;
        count: number;
    }) {
        this.name = object.name;
        this.count = object.count;
    }
}
