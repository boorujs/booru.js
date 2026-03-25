import { Comment } from "./comment.ts";
import type { RawComments } from "../../api/raw/interface/raw-comments.ts";

/**
 * An array of comments.
 */
export class Comments {
    /**
     * The post this list of comments are found under.
     * 
     * If not present, the comments are listed in most-recent order from all
     * posts on the site.
     */
    postId?: number;
    results: Comment[];

    constructor (object: {
        postId?: number;
        results: Comment[];
    }) {
        if (object.postId) this.postId = object.postId;
        this.results = object.results;
    }

    static fromRaw(raw: RawComments, postId?: number) {
        const array = raw.children.map((v, i) => Comment.fromRaw(v, i));
        return new this(postId
            ? { postId, results: array }
            : { results: array }
        );
    }
}
