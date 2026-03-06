import { overlayKeys } from "../../../../util/object/functions/overlay-keys.ts";
import type { Authentication } from "../interfaces/authentication.ts";
import type { BaseUser } from "../../misc/interfaces/base-user.ts";

/** A user tied to a client. */
export class ClientUser implements Pick<BaseUser, "id"> {
    id!: number;

    constructor (object: { id: number; }) {
        overlayKeys(this, object);
    }

    static fromAuth(auth: Pick<Authentication, "user_id">) {
        return new this({
            id: auth.user_id
        });
    }
}
