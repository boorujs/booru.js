import { BaseUser } from "../../misc/interfaces/base-user.ts";

/** The creator of a post. */
export class PostAuthor extends BaseUser {
    name: string;
    id: number;

    /** Whether the user is a bot. */
    get isBot(): boolean {
        return this.name === "bot";
    };

    constructor (object: {
        name: string;
        id: number;
    }) {
        super();
        this.name = object.name;
        this.id = object.id;

        this.bot = this.name === "bot";
    }
}
