import { Post } from "./post.ts";
import type { Client } from "../../client/classes/client.ts";
import type { RawPostJson, RawPostsJson } from "../../api/raw/interface/raw-posts-json.ts";
import type { RawPostsXml } from "../../api/raw/interface/raw-posts-xml.ts";

/** An array of posts. */
export class Posts extends Array<Post> {
    /** Query used to fetch the following posts. */
    query: string;
    /** Amount of posts that can be found with the query. */
    count: number;
    /** The offset of the returned results. */
    offset: number;

    constructor (array: Post[], object: {
        query: string;
        count: number;
        offset: number;
    }) {
        super(...array);
        this.query = object.query;
        this.count = object.count;
        this.offset = object.offset;
    }

    static fromRaw(client: Client, query: string, raw: {
        json: RawPostsJson;
        xml: RawPostsXml;
    }) {
        const merged: Post[] = [];
        raw.json.forEach((_, i) => merged.push(Post.fromRaw(
            client,
            {
                json: raw.json[i] as RawPostJson<true>,
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
