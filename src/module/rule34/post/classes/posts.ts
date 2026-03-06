import { Post } from "./post.ts";
import { overlayKeys } from "../../../../util/object/functions/overlay-keys.ts";
import type { Client } from "../../client/classes/client.ts";
import type { RawPostJSON, RawPostsJSON } from "../../api/raw/interface/raw-posts-json.ts";
import type { RawPostsXML } from "../../api/raw/interface/raw-posts-xml.ts";

/** An array of posts. */
export class Posts extends Array<Post> {
    /** Query used to fetch the following posts. */
    query!: string;
    /** Amount of posts that can be found with the query. */
    count!: number;
    /** The offset of the returned results. */
    offset!: number;

    // TODO: clean this bullshit up what the hell
    constructor (array: Post[], object: {
        query: string;
        count: number;
        offset: number;
    }) {
        super(...array);
        overlayKeys(this, object);
    }

    static fromRaw(client: Client, query: string, raw: {
        json: RawPostsJSON;
        xml: RawPostsXML;
    }) {
        const merged: Post[] = [];
        raw.json.forEach((_, i) => merged.push(Post.fromRaw(
            client,
            {
                json: raw.json[i] as RawPostJSON<true>,
                xml: raw.xml.children[i]!.attr
            }
        )));

        return new this(merged, {
            query: query,
            count: parseInt(raw.xml.attr.count),
            offset: parseInt(raw.xml.attr.offset)
        });
    }
}
