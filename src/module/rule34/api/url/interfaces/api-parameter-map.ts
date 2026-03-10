import type { Authentication } from "../../../client/interfaces/authentication.ts";

export interface ApiUrlParameterMap {
    "autocomplete": {
        params: { q: string; };
        args: [];
    };
    "post": {
        params: Authentication & {
            tags?: string;
            id?: number;
            limit?: number;
            pid?: number;
            json?: 0 | 1;
            fields?: "tag_info";
        };
        args: [ bothFormats?: boolean ];
    };
    "comment": {
        params: Authentication & {
            post_id?: number;
        };
    };
    "tag": {
        params: {
            id?: number;
            limit?: number;
        };
    };
}
