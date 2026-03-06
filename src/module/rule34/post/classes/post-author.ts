import { BaseUser } from "../../misc/interfaces/base-user.ts";
import { overlayKeys } from "../../../../util/object/functions/overlay-keys.ts";

/** The creator of a post. */
export class PostAuthor extends BaseUser {
    name!: string;
    id!: number;

    /** Whether the user is a bot. */
    bot: boolean;

    constructor (object: { name: string; id: number; }) {
        super();
        overlayKeys(this, object);
        this.bot = this.name === "bot";
    }
}
