import { PostFile } from "./post-file.ts";
import { MediaType } from "../../../../global/enums/media-type.ts";
import type { RawPostJson } from "../../api/raw/interface/raw-posts-json.ts";
import type { RawPostXml } from "../../api/raw/interface/raw-posts-xml.ts";

/** The files of a post. */
export class PostFiles extends PostFile {
    /** A downsampled version of the main file, if one exists; otherwise a
     * mirror of the main file. */
    sample: PostFile & {
        /** Whether the "downsample" is the same as the main file. */
        exists: boolean;
    };
    /** A very downsampled version of the main file. Typically used as a
     * thumbnail. */
    preview: PostFile;

    /** Whether this post's media is static, an animated image, or a video. */
    type: MediaType;
    /** The directory number of this post's CDN files. */
    directory: number;
    /** The filename (excluding the extension) of this post's CDN files. */
    hash: string;
    /** The file extension of this post's main CDN file. */
    extension: string;

    toJSON() {
        return {
            ...super.toJSON(),
            sample: {
                ...this.sample.toJSON(),
                exists: this.sample.exists
            },
            preview: this.preview,
            type: this.type,
            directory: this.directory,
            hash: this.hash,
            extension: this.extension
        };
    }
    
    static FILE_EXTENSIONS = <const> {
        Static: [ "jpeg", "jpg", "png" ],
        Animated: [ "gif" ],
        Video: [ "mp4" ]
    } satisfies {
        [K in keyof typeof MediaType]: string[];
    };

    constructor (object: {
        url: string;
        size: [ width: number, height: number ];
        sample: {
            url: string;
            size: [ width: number, height: number ];
        };
        preview: {
            url: string;
            size: [ width: number, height: number ];
        };
        directory: number;
        hash: string;
        image: string;
    }) {
        super(object);
        this.sample = <any> new PostFile(object.sample);
        this.sample.exists = this.url !== this.sample.url;
        this.preview = new PostFile(object.preview);

        const extension = object.image.match(/(?<=\.)\w+$/)![0];

        this.type = MediaType[
            (Object.keys(PostFiles.FILE_EXTENSIONS) as
                (keyof typeof PostFiles.FILE_EXTENSIONS)[])
            .find(key =>
                (PostFiles.FILE_EXTENSIONS[key] as string[])
                    .includes(extension)
            )!
        ];

        this.extension = extension;
        this.directory = object.directory;
        this.hash = object.hash;
    }

    static fromRaw({ json, xml }: {
        json: RawPostJson;
        xml: RawPostXml["attr"];
    }) {
        return new this({
            url: json.file_url,
            size: [ json.width, json.height ],
            sample: {
                url: json.sample_url,
                size: [ json.sample_width, json.sample_height ]
            },
            preview: {
                url: json.preview_url,
                size: [
                    parseInt(xml.preview_width),
                    parseInt(xml.preview_height)
                ]
            },
            directory: json.directory,
            hash: json.hash,
            image: json.image
        });
    }
}
