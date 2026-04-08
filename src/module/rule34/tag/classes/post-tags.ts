import { PostTag } from "./post-tag.ts";
import { TagType } from "../enums/tag-type.ts";
import type { RawPostJson } from "../../api/raw/interface/raw-posts-json.ts";

/** Array of tags found under a post. */
export class PostTags extends Array<PostTag> {
    /** Returns an array of the tags that match the given type. */
    ofCategory(category: TagType): PostTag[] {
        return this.filter(tag => tag.type === category);
    }

    /** Returns tags with {@link TagType.Copyright}. */
    get copyright(): PostTag[] {
        return this.ofCategory(TagType.Copyright);
    }
    /** Returns tags with {@link TagType.Character}. */
    get character(): PostTag[] {
        return this.ofCategory(TagType.Character);
    }
    /** Returns tags with {@link TagType.Artist}. */
    get artist(): PostTag[] {
        return this.ofCategory(TagType.Artist);
    }
    /** Returns tags with {@link TagType.General}. */
    get general(): PostTag[] {
        return this.ofCategory(TagType.General);
    }
    /** Returns tags with {@link TagType.Metadata}. */
    get metadata(): PostTag[] {
        return this.ofCategory(TagType.Metadata);
    }

    /** Returns a list of the tags' names concatenated with spaces. */
    override toString(): string {
        return this.map(i => i.name).join(" ");
    }

    constructor (...items: PostTag[]) {
        super(...items);
    }

    static fromRaw(raw: RawPostJson<true>) {
        return new this(...raw.tag_info.map(i => PostTag.fromRaw(i)));
    }
}
