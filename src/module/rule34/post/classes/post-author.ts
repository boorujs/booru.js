import { BaseUser } from "../../misc/interfaces/base-user.ts";

/** The creator of a post. */
export class PostAuthor extends BaseUser {
    name: string;
    id: number;

    /** Whether the user is a bot. */
    bot: boolean;

    //#region constructor
    static fromObject(object: { name: string; id: number; }) {
        return new PostAuthor(object);
    }

    constructor (option: { name: string; id: number; }) {
        super();
        this.name = option.name;
        this.id = option.id;
        this.bot = this.name === "bot";
    }
    //#endregion
}
