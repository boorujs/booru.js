import { PostTag } from "./post-tag.ts";
import type { TagType } from "../enums/tag-type.ts";
import type { RawPostJson } from "../../api/raw/interface/raw-posts-json.ts";

/** Array of tags found under a post. */
export class PostTags extends Array<PostTag> {    
    /** Returns an array of the tags that match the given type. */
    ofCategory<T extends TagType>(category: T): PostTag<T>[] {
        return Array.from(this).filter(tag => tag.type === category) as PostTag<T>[];
    }

    /** Returns a list of the tags' names concatenated with spaces. */
    override toString(): string {
        return this.map(i => i.name).join(" ");
    }

    constructor (array: PostTag[]) {
        super(...array);
    }

    static fromRaw(raw: RawPostJson<true>) {
        return new this({
            string: raw.tags,
            tags: raw.tag_info.map(i => PostTag.fromRaw(i))
        });
    }
}
