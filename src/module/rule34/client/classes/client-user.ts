import type { Authentication } from "../interfaces/authentication.ts";
import type { BaseUser } from "../../misc/interfaces/base-user.ts";

/** A user tied to a client. */
export class ClientUser implements Pick<BaseUser, "id"> {
    id: number;

    toJSON() {
        return {
            id: this.id
        };
    }

    constructor (object: {
        id: number;
    }) {
        this.id = object.id;
    }

    static fromAuth(auth: Pick<Authentication, "user_id">) {
        return new this({
            id: auth.user_id
        });
    }
}
