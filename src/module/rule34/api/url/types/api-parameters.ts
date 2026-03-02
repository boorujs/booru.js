export interface Autocomplete {
    q: string;
}

export type Search<J extends boolean | unknown = unknown> = {
    tags?: string;
    id?: number;
    limit?: number;
    pid?: number;
} & (
    J extends false
        ? { json?: 0; }
        : J extends true
            ? { json: 1; fields?: "tag_info" | string; }
            : 
                | { json?: 0; }
                | { json: 1; fields?: "tag_info" | string; }
);
