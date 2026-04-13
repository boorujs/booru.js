import { Post } from "./post.ts";
import type { Client } from "../../client/classes/client.ts";
import type { RawPostJson, RawPostsJson } from "../../api/raw/interface/raw-posts-json.ts";
import type { RawPostsXml } from "../../api/raw/interface/raw-posts-xml.ts";

/** Search results of posts. */
export class Search {
    #client: Client;

    private query: Parameters<Client["search"]>;

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

    /** Returns whether this object represents the first page of results. */
    prevPageExists(): boolean {
        return this.offset !== 0;
    }

    /** Returns the next page of results. */
    async getNextPage(): Promise<Search | null> {
        if (!this.nextPageExists()) return null;

        let [query, options] = this.query;

        if (options)
            if (typeof options.page !== "undefined") ++options.page;
            else options.page = 1;
        else options = { page: 1 };

        return await this.#client.search(query, options);
    }

    /** Returns the previous page of results. */
    async getPrevPage(): Promise<Search | null> {
        if (!this.prevPageExists()) return null;

        let [query, options] = this.query;

        --options!.page;

        return await this.#client.search(query, options);
    }

    toJSON() {
        return {
            count: this.count,
            offset: this.offset,
            results: this.results
        };
    }

    constructor (object: {
        client: Client;
        query: Parameters<Client["search"]>;
        count: number;
        offset: number;
        results: Post[];
    }) {
        this.#client = object.client;
        this.query = object.query;
        this.count = object.count;
        this.offset = object.offset;
        this.results = object.results;
    }

    static fromRaw(
        client: Client,
        query: Parameters<Client["search"]>,
        raw: {
            json: RawPostsJson;
            xml: RawPostsXml;
        }
    ) {
        const merged: Post[] = [];
        raw.json.forEach((_, i) => merged.push(Post.fromRaw(
            client,
            {
                json: raw.json[i] as RawPostJson<true>,
                xml: raw.xml.children[i]!.attr
            }
        )));

        return new this({
            client: client,
            query: query,
            count: parseInt(raw.xml.attr.count),
            offset: parseInt(raw.xml.attr.offset),
            results: merged
        });
    }
}
