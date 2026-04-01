import type { TagType } from "../enums/tag-type.ts";

export interface TagKeysMap {
    "name": {
        /** The name and value of the tag. */
        name: string;
    };
    "count": {
        /** The amount of posts that use this tag. */
        count: number;
    };
    "type": {
        /** The category of this tag. */
        type: TagType;
    };
    "id": {
        /** The unique ID of the tag. */
        id: number;
    
        /** Returns a URL to this tag's wiki page on rule34.xxx. */
        toWikiURL(): string;
    };
    "ambiguous": {
        // TODO
        /** It is uncertain what this property labels. */
        ambiguous: boolean;
    };
}

