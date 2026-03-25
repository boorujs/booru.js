import { Post } from "./post.ts";
import type { Client } from "../../client/classes/client.ts";
import type { RawPostJson, RawPostsJson } from "../../api/raw/interface/raw-posts-json.ts";
import type { RawPostsXml } from "../../api/raw/interface/raw-posts-xml.ts";

/** Search results of posts. */
export class Search {
    /** Amount of posts that can be found with the query. */
    count: number;
    /** The offset of the returned results. */
    offset: number;
    /** Resulting posts from the query. */
    results: Post[];

    /** Returns whether posts may appear on the following page of results. */
    nextPageExists(): boolean {
        return (this.offset + this.results.length) < this.count;
    }

    constructor (object: {
        count: number;
        offset: number;
        results: Post[]
    }) {
        this.count = object.count;
        this.offset = object.offset;
        this.results = object.results;
    }

    static fromRaw(client: Client, raw: {
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

        return new this({
            count: parseInt(raw.xml.attr.count),
            offset: parseInt(raw.xml.attr.offset),
            results: merged
        });
    }
}
