import { PostFileType } from "../enums/post-file-type.ts";
import { overlayKeys } from "../../../../util/object/functions/overlay-keys.ts";
import type { RawPostJSON } from "../../api/raw/interface/raw-posts-json.ts";
import type { RawPostXML } from "../../api/raw/interface/raw-posts-xml.ts";

/** A set of the files of a post. */
export class PostFile {
    url!: string;
    size!: [ width: number, height: number ];
    
    constructor (object: {
        url: string;
        size: [ width: number, height: number ];
    }) {
        overlayKeys(this, object);
    }
}

/** The files of a post. */
export class PostFiles extends PostFile {
    downsample: PostFile & { exists: boolean; };
    thumbnail: PostFile;

    type: PostFileType;
    directory: number;
    hash: string;
    extension: string;
    
    static FILE_EXTENSIONS = <const> {
        Static: [ "jpeg", "jpg", "png" ],
        Animated: [ "gif" ],
        Video: [ "mp4" ]
    } satisfies {
        [K in keyof typeof PostFileType]: string[];
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

        this.type = PostFileType[
            (Object.keys(PostFiles.FILE_EXTENSIONS) as
                (keyof typeof PostFiles.FILE_EXTENSIONS)[])
            .find(key =>
                (PostFiles.FILE_EXTENSIONS[key] as string[])
                    .includes(this.extension)
            )!
        ];
        // ERROR

        this.directory = object.directory;
        this.hash = object.hash;
    }

    static fromRaw({ json, xml }: {
        json: RawPostJSON;
        xml: RawPostXML["attr"];
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
