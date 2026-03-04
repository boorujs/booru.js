import { TagType } from "../enums/tag-type.ts";
import { tagWiki as getURL } from "../../util/functions/site-url.ts";

/** The base interface for tags. */
export abstract class BaseTag<T extends TagType = TagType> {
    /** The name and value of the tag. */
    abstract name: string;
    /** The unique ID of the tag. */
    abstract id: number;
    /** The amount of posts that use this tag. */
    abstract count: number;
    /** The category of this tag. */
    abstract type: T;
    // TODO
    /** It is uncertain what this property labels. */
    abstract ambiguous: boolean;

    /** Returns a URL to this tag's wiki page on rule34.xxx. */
    toWikiURL(): string { return getURL(this.id); }
}
