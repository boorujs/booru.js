import { ClientUser } from "./client-user.ts";
import { AUTHENTICATION_RESPONSE } from "../constants/authentication-response.ts";
import { apiUrl } from "../../api/url/functions/api-url.ts";
import { Comments } from "../../misc/classes/comments.ts";
import { Post } from "../../post/classes/post.ts";
import { Search } from "../../post/classes/search.ts";
import { AutocompleteTag } from "../../tag/classes/autocomplete-tag.ts";
import { BoorujsError } from "../../../../error/classes/boorujs-error.ts";
import { resolvePromisesOfObject } from "../../../../util/object/functions/resolve-promises-of-object.ts";
import { fetchJson, fetchXml } from "../../../../util/rest.ts";
import type { Authentication } from "../interfaces/authentication.ts";
import type { ClientOptions } from "../interfaces/client-options.ts";
import type { RawAutocompleteTags } from "../../api/raw/interface/raw-autocomplete-tag.ts";
import type { RawPostsJson } from "../../api/raw/interface/raw-posts-json.ts";
import type { RawPostsXml } from "../../api/raw/interface/raw-posts-xml.ts";
import type { RawComments } from "../../api/raw/interface/raw-comments.ts";

/** Client to retrieve data from Rule 34 at rule34.xxx. */
export class Client {
    #auth: Authentication;

    protected authorized: boolean = false;
    
    /** The user tied to the client. */
    self: ClientUser;
    
    constructor (options: ClientOptions) {
        this.#auth = options.auth;
        this.self = ClientUser.fromAuth(options.auth);
    }

    /**
     * Returns the client if the credentials are valid, otherwise throws an
     * error.
     */
    async test(): Promise<this | never> {
        if (!this.authorized) {
            // API REQUEST
            const response = await fetch(apiUrl("post", {
                limit: 0,
                json: 1,
                ...this.#auth
            })).then(r => r.text());

            switch (response) {
                case AUTHENTICATION_RESPONSE.JSON_EMPTY:
                    this.authorized = true;
                    break;
                case AUTHENTICATION_RESPONSE.JSON_MISSING_AUTHENTICATION:
                    BoorujsError.throw("INVALID_AUTH");
                case AUTHENTICATION_RESPONSE.NO_RESPONSE_DATA:
                    BoorujsError.throw("RULE34_NO_AUTH_RESPONSE_DATA");
                default:
                    BoorujsError.throw(
                        "RULE34_UNEXPECTED_AUTH_RESPONSE", [ response ]
                    );
            }
        }

        return this;
    }

    static MALFORMED_AUTOCOMPLETE_REGEX = /\\r\\n/;

    /**
     * Returns autocomplete suggestions for an incomplete tag.
     */
    async autocomplete(tag: string): Promise<AutocompleteTag[]> {
        return await fetchJson(apiUrl("autocomplete", {
            q: tag
        })).then((raw: RawAutocompleteTags) => {
            const array = raw.map(i => AutocompleteTag.fromRaw(i));
            const invalid = array.findIndex(
                i => Client.MALFORMED_AUTOCOMPLETE_REGEX.test(i.name)
            );
            return array.slice(0, invalid === -1
                ? array.length
                : invalid
            );
        });
    }

    /**
     * Returns posts resulting from a search query.
     */
    async search(
        query: string,
        options?: { perPage?: number; page?: number; }
    ): Promise<Search> {
        const url = apiUrl(
            "post",
            {
                tags: query,
                limit: options?.perPage ?? 42,
                pid: options?.page ?? 0,
                fields: "tag_info",
                ...this.#auth
            },
            true
        );

        return await resolvePromisesOfObject({
            // API REQUEST
            xml: fetchXml(url.xml) as Promise<RawPostsXml>,
            // API REQUEST
            json: fetchJson(url.json) as Promise<RawPostsJson>
        }).then(response => Search.fromRaw(this, response));
    }

    /**
     * Returns the post at a given ID.
     */
    async getPost(id: number): Promise<Post | null> {
        return await this.search(`id:${id}`, {
            perPage: 1,
            page: 0
        }).then(p => p.results[0] ?? null);
    }

    /**
     * Returns an array of comments.
     * @param id The post ID to get the comments of. If unspecified, comments
     * across all posts are returned.
     */
    async getComments(id?: number): Promise<Comments> {
        // API REQUEST
        return await fetchXml(apiUrl(
            "comment",
            id ? { post_id: id } : {}
        )).then(i => Comments.fromRaw(i as any as RawComments));
    }
}
