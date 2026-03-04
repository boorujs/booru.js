import { user as getURL } from "../../util/functions/site-url.ts";

/** The base interface for users. */
export abstract class BaseUser {
    /** The username of the user. */
    abstract name: string;
    /** The unique ID of the user. */
    abstract id: number;
    
    /** Returns a URL to this user's profile on rule34.xxx. */
    toURL(): string { return getURL(this.name); }
}
