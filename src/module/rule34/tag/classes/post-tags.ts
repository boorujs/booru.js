import { PostTag } from "./post-tag.ts";
import { TagType } from "../enums/tag-type.ts";
import type { RawPostJson } from "../../api/raw/interface/raw-posts-json.ts";

/** Array of tags found under a post. */
export class PostTags extends Array<PostTag> {
    /** Returns an array of the tags that match the given type. */
    ofCategory<T extends TagType>(category: T): PostTag<T>[] {
        return this.filter(tag => tag.type === category) as PostTag<T>[];
    }

    /** Returns tags with {@link TagType.Copyright}. */
    get copyright(): PostTag<TagType.Copyright>[] {
        return this.ofCategory(TagType.Copyright);
    }
    /** Returns tags with {@link TagType.Character}. */
    get character(): PostTag<TagType.Character>[] {
        return this.ofCategory(TagType.Character);
    }
    /** Returns tags with {@link TagType.Artist}. */
    get artist(): PostTag<TagType.Artist>[] {
        return this.ofCategory(TagType.Artist);
    }
    /** Returns tags with {@link TagType.General}. */
    get general(): PostTag<TagType.General>[] {
        return this.ofCategory(TagType.General);
    }
    /** Returns tags with {@link TagType.Metadata}. */
    get metadata(): PostTag<TagType.Metadata>[] {
        return this.ofCategory(TagType.Metadata);
    }

    /** Returns a list of the tags' names concatenated with spaces. */
    override toString(): string {
        return this.map(i => i.name).join(" ");
    }

    constructor (array: PostTag[]) {
        super(...array);
    }

    static fromRaw(raw: RawPostJson<true>) {
        return new this(raw.tag_info.map(i => PostTag.fromRaw(i)));
    }
}
