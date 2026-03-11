import { Comment } from "./comment.ts";
import type { RawComments } from "../../api/raw/interface/raw-comments.ts";

/**
 * An array of comments.
 */
export class Comments extends Array<Comment> {
    /**
     * The post this list of comments are found under.
     * 
     * If not present, the comments are listed in most-recent order regardless
     * of what post each one is under, i.e. from all posts on the site.
     */
    postId?: number;

    constructor (object: {
        postId?: number;
        array: Comment[];
    }) {
        super(...object.array);
        if (object.postId) this.postId = object.postId;
    }

    static fromRaw(raw: RawComments, postId?: number) {
        const array = raw.children.map((v, i) => Comment.fromRaw(v, i));
        return new this(postId
            ? { postId, array }
            : { array }
        );
    }
}
