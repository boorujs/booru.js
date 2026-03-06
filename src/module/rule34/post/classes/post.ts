import { PostAuthor } from "./post-author.ts";
import { PostFiles } from "./post-files.ts";
import { PostRating } from "../enums/post-rating.ts";
import { PostStatus } from "../enums/post-status.ts";
import { PostTags } from "../../tag/classes/post-tags.ts";
import { overlayKeys } from "../../../../util/object/functions/overlay-keys.ts";
import type { RawPostJSON } from "../../api/raw/interface/raw-posts-json.ts";
import type { RawPostXML } from "../../api/raw/interface/raw-posts-xml.ts";
import type { Client } from "../../client/classes/client.ts";

/** A post. */
export class Post {
    protected client!: Client;
    protected hasChildren!: boolean;
    protected commentCount!: boolean;

    file!: PostFiles;

    id!: number;
    parent!: number | null;
    source!: string;
    rating!: PostRating;
    author!: PostAuthor;

    created!: Date;
    modified!: Date;
    status!: PostStatus;

    score!: number;
    tags!: PostTags;
    
    static RAW_RATING = {
        "safe": "Safe",
        "questionable": "Questionable",
        "explicit": "Explicit"
    } satisfies {
        [K in RawPostJSON["rating"]]: keyof typeof PostRating;
    };
    static RAW_STATUS = {
        "active": "Active",
        "flagged": "Flagged",
        "deleted": "Deleted"
    } satisfies {
        [K in RawPostJSON["status"]]: keyof typeof PostStatus;
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
        overlayKeys(this, object);
    }

    static fromRaw(
        client: Client,
        { json, xml }: { json: RawPostJSON<true>; xml: RawPostXML["attr"]; }
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
            // ERROR
            author: new PostAuthor({
                name: json.owner,
                id: parseInt(xml.creator_id)
                // ERROR
            }),

            created: new Date(xml.created_at),
            // ERROR
            modified: new Date(json.change * 1000),
            // ERROR
            status: PostStatus[Post.RAW_STATUS[json.status]],
            // ERROR

            score: json.score,
            tags: PostTags.fromRaw(json)
        });
    }
}
