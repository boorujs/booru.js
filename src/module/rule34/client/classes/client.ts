import { ClientUser } from "./client-user.ts";
import { AUTHENTICATION_RESPONSE } from "../constants/authentication-response.ts";
import { apiUrl } from "../../api/url/functions/api-url.ts";
import { Post } from "../../post/classes/post.ts";
import { Posts } from "../../post/classes/posts.ts";
import { AutocompleteTags } from "../../tag/classes/autocomplete-tags.ts";
import { BooruAbuseError } from "../../../../error/classes/booru-abuse-error.ts";
import { resolvePromisesOfObject } from "../../../../util/object/functions/await-promises-of-object.ts";
import { fetchJson, fetchXml } from "../../../../util/rest.ts";
import type { Authentication } from "../interfaces/authentication.ts";
import type { ClientOptions } from "../interfaces/client-options.ts";

/** Client to retrieve data from Rule 34 at rule34.xxx. */
export class Client {
    #auth: Authentication;

    protected authorized: boolean = false;
    
    /** The user tied to the client. */
    self: ClientUser;
    
    // TODO: create gh issue on func overloads as generic type params
    /* NOTE: this is going to make me kill myself.
     * 
     * i have spent countless hours trying to type this correctly so that it
     * acts *equivalently* to APIURL but that credentials aren't required in
     * params. typescript's (surely fully implemented) overloading feature makes
     * this IMPOSSIBLE because generic types assume the last-defined overload of
     * a function, meaning usage of APIURL as a generic type parameter narrows
     * down to a grand:
     * 
     * (s: "post", params: { ...; }, bothFormats: true) => { json; xml; }
     * 
     * thank you microsoft for pushing an expansively typed version of a
     * (notoriously) slow enough and deeply flawed language on the programmer
     * market and making my life trying to engage in a hobby a living hell. i
     * hope each and every one of the marketers of copilot and vibe coding gets
     * analraped until their excruciated death.
     * 
     * to "vibe" "coders" who believe themselves to be legitimate programmers i
     * say this to you: go learn a hobby or get a job you can actually do
     * without the slave labour of the Ocean Boiler and Societal Development
     * Retarder 2000. you are a margin of the reason that windows 11 is
     * developed the way it is and that it has advertisements engrained into its
     * software.
     * 
     * and to the faggots that participate in the black market/cashgrab scheme
     * of vibe coding entire websites you get this from me: kill yourself.
     * preferably as long and painfully as possible, but however you do it, the
     * world needs you gone.
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
            xml: fetchXml(url.xml),
            // API REQUEST
            json: fetchJson(url.json)
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
