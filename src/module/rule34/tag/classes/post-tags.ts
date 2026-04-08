import { PostTag } from "./post-tag.ts";
import { PostTagTyped } from "./post-tag-typed.ts";
import { TagType } from "../enums/tag-type.ts";
import type { RawPostJson } from "../../api/raw/interface/raw-posts-json.ts";

/** Tags found under a post, organized by category. */
export class PostTags {
    private all: PostTagTyped[];

    /**
     * Returns an array of all tags sorted by their name alphabetically and
     * with their type attributed to each.
     */
    flat(): PostTagTyped[] {
        return this.all;
    }

    /** Returns an array of the tags that match the given type. */
    ofCategory(category: TagType): PostTag[] {
        return this.all
            .filter(tag => tag.type === category)
            .map(i => new PostTag(i));
    }

    /** Tags under the {@link TagType.Copyright copyright type}. */
    get copyright(): PostTag[] {
        return this.ofCategory(TagType.Copyright);
    }
    /** Tags under the {@link TagType.Character character type}. */
    get character(): PostTag[] {
        return this.ofCategory(TagType.Character);
    }
    /** Tags under the {@link TagType.Artist artist type}. */
    get artist(): PostTag[] {
        return this.ofCategory(TagType.Artist);
    }
    /** Tags under the {@link TagType.General general type}. */
    get general(): PostTag[] {
        return this.ofCategory(TagType.General);
    }
    /** Tags under the {@link TagType.Metadata metadata type}. */
    get metadata(): PostTag[] {
        return this.ofCategory(TagType.Metadata);
    }
    /** Tags under the {@link TagType.Ambiguous ambiguous type}. */
    get ambiguous(): PostTag[] {
        return this.ofCategory(TagType.Ambiguous);
    }

    /** Returns a list of the tags' names concatenated with spaces. */
    override toString(): string {
        return all.map(i => i.name).join(" ");
    }

    constructor (array: PostTagTyped[]) {
        this.all = array;
    }

    static fromRaw(raw: RawPostJson<true>) {
        return new this(raw.tag_info.map(i => PostTagTyped.fromRaw(i)));
    }
}
