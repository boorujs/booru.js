import type { BaseTag } from "./base-tag.ts";

/** Abstract class for tags with an attributed type. */
export abstract class TagWithType extends BaseTag {
    /** The category of this tag. */
    abstract type: TagType;
}
