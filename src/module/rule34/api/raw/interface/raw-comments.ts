type NumericString = `${number}`;

export interface RawComments {
    name: "comments";
    attr: {
        type: "array";
    };
    children: {
        name: "comment";
        attr: {
            created_at: string;
            post_id: NumericString;
            body: string;
            creator: string;
            id: NumericString;
            creator_id: NumericString;
        };
    }[];
}

export type RawComment = RawComments["children"][number];
