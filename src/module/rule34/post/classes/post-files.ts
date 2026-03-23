import { MediaType } from "../../../../global/enums/media-type.ts";
import type { RawPostJson } from "../../api/raw/interface/raw-posts-json.ts";
import type { RawPostXml } from "../../api/raw/interface/raw-posts-xml.ts";

/** A set of the files of a post. */
export class PostFile {
    /** The CDN URL of the media file. */
    url: string;
    /** The dimensions of the media file. */
    size: [ width: number, height: number ];
    
    constructor (object: {
        url: string;
        size: [ width: number, height: number ];
    }) {
        this.url = object.url;
        this.size = object.size;
    }
}

/** The files of a post. */
export class PostFiles extends PostFile {
    /**
     * The downsampled version of the main file, if one exists; otherwise a
     * mirror of the main file.
     */
    downsample: PostFile & {
        /** Whether a downsample exists for this post's main file. */
        exists: boolean;
    };
    /**
     * A very downsampled version of the main file, intended for use as a
     * thumbnail.
     */
    thumbnail: PostFile;

    /** Whether this post's media is static, an animated image, or a video. */
    type: MediaType;
    /** The directory number of this post's CDN files. */
    directory: number;
    /** The filename (excluding the extension) of this post's CDN files. */
    hash: string;
    /** The file extension of this post's main CDN file. */
    extension: string;
    
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
        downsample: {
            url: string;
            size: [ width: number, height: number ];
        };
        thumbnail: {
            url: string;
            size: [ width: number, height: number ];
        };
        directory: number;
        hash: string;
        image: string;
    }) {
        super(object);
        this.downsample = <any> new PostFile(object.downsample);
        this.downsample.exists = this.url !== this.downsample.url;
        this.thumbnail = new PostFile(object.thumbnail);

        this.extension = object.image.match(/(?<=\.)\w+$/)![0];

        this.type = MediaType[
            (Object.keys(PostFiles.FILE_EXTENSIONS) as
                (keyof typeof PostFiles.FILE_EXTENSIONS)[])
            .find(key =>
                (PostFiles.FILE_EXTENSIONS[key] as string[])
                    .includes(this.extension)
            )!
        ];

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
            downsample: {
                url: json.sample_url,
                size: [ json.sample_width, json.sample_height ]
            },
            thumbnail: {
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
