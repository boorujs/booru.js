import { CommentAuthor } from "./comment-author.ts";
import type { RawComment } from "../../api/raw/interface/raw-comments.ts";

/**
 * A comment under a post.
 */
export class Comment {
    /** The ID of the post over this comment. */
    postId: number;
    /** The comment's unique ID. */
    id: number;
    /** The author of the comment. */
    author: CommentAuthor;
    /** The text content of the comment. */
    body: string;
    /**
     * The zero-indexed position of this comment in the comment list of its
     * post.
     */
    index: number;

    constructor (object: {
        postId: number;
        id: number;
        author: CommentAuthor;
        body: string;
        index: number;
    }) {
        this.postId = object.postId;
        this.id = object.id;
        this.author = object.author;
        this.body = object.body;
        this.index = object.index;
    }

    static fromRaw(raw: RawComment, index: number) {
        return new this({
            postId: parseInt(raw.attr.post_id),
            id: parseInt(raw.attr.id),
            author: new CommentAuthor({
                name: raw.attr.creator,
                id: parseInt(raw.attr.creator_id)
            }),
            body: raw.attr.body,
            index: index
        });
    }
}
