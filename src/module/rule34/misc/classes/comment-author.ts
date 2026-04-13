import { BaseUser } from "../interfaces/base-user.ts";

/** The user found as the author of a comment. */
export class CommentAuthor extends BaseUser {
    name: string;
    id: number;

    toJSON() {
        return {
            name: this.name,
            id: this.id
        };
    }
    constructor (object: {
        name: string;
        id: number;
    }) {
        super();
        this.name = object.name;
        this.id = object.id;
    }
}
