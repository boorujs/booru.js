/** A set of the files of a post. */
export class PostFile {
    /** The CDN URL of the media file. */
    url: string;
    /** The dimensions of the media file. */
    size: [ width: number, height: number ];

    toJSON() {
        return {
            url: this.url,
            size: this.size
        };
    }
    
    constructor (object: {
        url: string;
        size: [ width: number, height: number ];
    }) {
        this.url = object.url;
        this.size = object.size;
    }
}
