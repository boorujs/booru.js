import type { Authentication } from "../interfaces/authentication.ts";
import type { BaseUser } from "../../misc/interfaces/base-user.ts";

/** A user tied to a client. */
export class ClientUser implements Pick<BaseUser, "id"> {
    id: number;

    //#region constructor
    static fromAuth(auth: Pick<Authentication, "user_id">) {
        return ClientUser.fromObject({
            id: auth.user_id
        });
    }

    static fromObject(object: { id: number; }) {
        return new ClientUser(object);
    }

    constructor (option: { id: number; }) {
        this.id = option.id;
    }
    //#endregion
}
