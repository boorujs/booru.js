import { PostAuthor } from "./post-author.ts";
import { PostFiles } from "./post-files.ts";
import { PostRating } from "../enums/post-rating.ts";
import { PostStatus } from "../enums/post-status.ts";
import { Comments } from "../../misc/classes/comments.ts";
import { PostTags } from "../../tag/classes/post-tags.ts";
import type { RawPostJson } from "../../api/raw/interface/raw-posts-json.ts";
import type { RawPostXml } from "../../api/raw/interface/raw-posts-xml.ts";
import type { Client } from "../../client/classes/client.ts";

/** A post. */
export class Post {
    /** The client used to fetch this post. */
    protected client: Client;
    /** Whether this post claims to have children. */
    protected hasChildren: boolean;
    /** The amount of comments under this post. */
    protected commentCount: number;

    /** The CDN media files of this post. */
    file: PostFiles;

    /** The unique ID of this post. */
    id: number;
    /** The parent of this post if one exists. */
    parent: number | null;
    /** The user-provided source of this post. Commonly a URL, but may be any
     * string. */
    source: string;
    /** The maturity rating of this post's media. */
    rating: PostRating;
    /** The creator of the post. */
    author: PostAuthor;

    /** The date of this post's creation. */
    created: Date;
    /** The date of this post's last modification. */
    modified: Date;
    /** The moderation status of this post. */
    status: PostStatus;

    /** The total upvotes given to this post. */
    score: number;
    /** The list of tags this post is associated with. */
    tags: PostTags;

    /** Returns the user comments under this post. */
    async getComments(): Promise<Comments> {
        return await this.client.getComments(this.id);
    }

    toJSON() {
        return {
            file: this.file,
            id: this.id,
            parent: this.parent,
            source: this.source,
            rating: this.rating,
            author: this.author,
            created: this.created,
            modified: this.modified,
            status: this.status,
            score: this.score,
            tags: this.tags
        };
    }
    
    static RAW_RATING = {
        "safe": "Safe",
        "questionable": "Questionable",
        "explicit": "Explicit"
    } satisfies {
        [K in RawPostJson["rating"]]: keyof typeof PostRating;
    };
    static RAW_STATUS = {
        "active": "Active",
        "flagged": "Flagged",
        "deleted": "Deleted"
    } satisfies {
        [K in RawPostJson["status"]]: keyof typeof PostStatus;
    };

    constructor (object: {
        client: Client;
        hasChildren: boolean;
        commentCount: number;
        file: PostFiles;
        id: number;
        parent: number | null;
        source: string;
        rating: PostRating;
        author: PostAuthor;
        created: Date;
        modified: Date;
        status: PostStatus;
        score: number;
        tags: PostTags;
    }) {
        this.client = object.client;
        this.hasChildren = object.hasChildren;
        this.commentCount = object.commentCount;
        this.file = object.file;
        this.id = object.id;
        this.parent = object.parent;
        this.source = object.source;
        this.rating = object.rating;
        this.author = object.author;
        this.created = object.created;
        this.modified = object.modified;
        this.status = object.status;
        this.score = object.score;
        this.tags = object.tags;
    }

    static fromRaw(
        client: Client,
        { json, xml }: { json: RawPostJson<true>; xml: RawPostXml["attr"]; }
    ) {
        return new this({
            client: client,
            hasChildren: xml.has_children === "true",
            commentCount: json.comment_count,

            file: PostFiles.fromRaw({ json, xml }),

            id: json.id,
            parent: json.parent_id || null,
            source: json.source,
            rating: PostRating[Post.RAW_RATING[json.rating]],
            author: new PostAuthor({
                name: json.owner,
                id: parseInt(xml.creator_id)
            }),

            created: new Date(xml.created_at),
            modified: new Date(json.change * 1000),
            status: PostStatus[Post.RAW_STATUS[json.status]],

            score: json.score,
            tags: PostTags.fromRaw(json)
        });
    }
}
