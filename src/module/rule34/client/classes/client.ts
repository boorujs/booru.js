import { ClientUser } from "./client-user.ts";
import { AUTHENTICATION_RESPONSE } from "../constants/authentication-response.ts";
import { apiUrl } from "../../api/url/functions/api-url.ts";
import { Post } from "../../post/classes/post.ts";
import { Posts } from "../../post/classes/posts.ts";
import { AutocompleteTags } from "../../tag/classes/autocomplete-tags.ts";
import { BooruAbuseError } from "../../../../error/classes/booru-abuse-error.ts";
import { resolvePromisesOfObject } from "../../../../util/object/functions/resolve-promises-of-object.ts";
import { fetchJson, fetchXml } from "../../../../util/rest.ts";
import type { Authentication } from "../interfaces/authentication.ts";
import type { ClientOptions } from "../interfaces/client-options.ts";
import type { RawPostsJson } from "../../api/raw/interface/raw-posts-json.ts";
import type { RawPostsXml } from "../../api/raw/interface/raw-posts-xml.ts";

/** Client to retrieve data from Rule 34 at rule34.xxx. */
export class Client {
    #auth: Authentication;

    protected authorized: boolean = false;
    
    /** The user tied to the client. */
    self: ClientUser;
    
    // TODO: create gh issue on func overloads as generic type params
    /* NOTE: this can be typed better.
     * 
     * i want to type this, using (typeof) apiUrl itself, so that it acts
     * *equivalently* to apiUrl but that credentials aren't required in params.
     * 
     * typescript's (surely fully implemented) overloading feature makes this
     * IMPOSSIBLE by using apiUrl directly because generic types assume the last
     * defined overload of a function parameter, meaning usage of apiUrl as a
     * generic type parameter narrows down to a grand:
     * 
     *     (s: "post", params: { ...; }, bothFormats: true) => { json; xml; }
     * 
     * this makes the only way to achieve what im looking for accessible via the
     * good ol' ctrl + (c | v). which ive been advised against using as much as
     * possible. and honestly id rather die than deal with that currently.
     */
    apiUrl = (s: string, params: any, ...args: any[]) =>
        <any> (apiUrl as any)(s, { ...params, ...this.#auth }, ...args);
    
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
            const response = await fetch(this.apiUrl("post", {
                limit: 0,
                json: 1
            })).then(r => r.text());

            switch (response) {
                case AUTHENTICATION_RESPONSE.EMPTY_ARRAY:
                    this.authorized = true;
                    break;
                case AUTHENTICATION_RESPONSE.MISSING_AUTHENTICATION:
                    BooruAbuseError.throw("INVALID_AUTH");
                default:
                    BooruAbuseError.throw(
                        "RULE34_UNEXPECTED_AUTH_RESPONSE", [ response ]
                    );
            }
        }

        return this;
    }
    
    static AUTOCOMPLETE_LAST_TAG_REGEX = /(?<= ?)[^ ]+$/;

    /**
     * Returns autocomplete suggestions for a given tag.
     * @param tag The incomplete tag.
     */
    async autocomplete(tag: string): Promise<AutocompleteTags> {
        return await fetchJson(this.apiUrl(
            "autocomplete",
            { q: tag.match(Client.AUTOCOMPLETE_LAST_TAG_REGEX)![0] })
            // ERROR
        ).then(raw => AutocompleteTags.fromRaw(raw, tag));
    }

    /**
     * Returns posts resulting from a search query.
     * @param query The search query.
     * @param options The options to affect the returned results.
     */
    async search(
        query: string,
        options?: { perPage?: number; page?: number; }
    ): Promise<Posts> {
        const url = this.apiUrl("post", {
            tags: query,
            limit: options?.perPage ?? 42,
            pid: options?.page ?? 0,
            fields: "tag_info"
        }, true);

        return await resolvePromisesOfObject({
            // API REQUEST
            xml: fetchXml(url.xml) as Promise<RawPostsXml>,
            // API REQUEST
            json: fetchJson(url.json) as Promise<RawPostsJson>
        }).then(response => Posts.fromRaw(this, query, response));
    }

    /**
     * Returns the post at a given ID.
     * @param id The given ID.
     */
    async getPost(id: number): Promise<Post | null> {
        return await this.search(`id:${id}`, {
            perPage: 1,
            page: 0
        }).then(p => p[0] ?? null);
    }
}
