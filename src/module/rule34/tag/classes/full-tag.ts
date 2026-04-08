import type { TagType } from "../enums/tag-type.ts";
import type { BaseTag } from "./base-tag.ts";

/** The abstract class for fully-implemented tags. */
export abstract class FullTag extends BaseTag {
    /** The category of this tag. */
    type: TagType;
    /** The unique ID of this tag. */
    id: number;
    // TODO
    /** It is uncertain what this property labels. */
    ambiguous: boolean;

    /** Returns a URL to this tag's wiki page on rule34.xxx. */
    toWikiURL(): string;
}
