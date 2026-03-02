import { PostTag } from "./post-tag.ts";
import type { TagType } from "../enums/tag-type.ts";
import type { RawPostJSON } from "../../api/raw/interface/raw-posts-json.ts";

/** Array of tags found under a post. */
export class PostTags extends Array<PostTag> {
    protected string: string;

    //#region constructor
    static fromRaw(raw: RawPostJSON<true>) {
        return PostTags.fromObject({
            string: raw.tags,
            tags: raw.tag_info.map(PostTag.fromRaw)
        });
    }

    static fromObject(object: ConstructorParameters<typeof this>[0]) {
        return new PostTags(object);
    }

    protected constructor (object: { string: string; tags: PostTag[] }) {
        super(...object.tags);
        this.string = object.string;
    }
    //#endregion
    
    ofCategory<T extends TagType>(category: T): PostTag<T>[] {
        return this.filter(tag => tag.type === category);
    }

    override toString(): string { return this.string; }
}