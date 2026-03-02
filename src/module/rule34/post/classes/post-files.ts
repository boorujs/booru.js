import { PostFileType } from "../enums/post-file-type.ts";
import type { RawPostJSON } from "../../api/raw/interface/raw-posts-json.ts";
import type { RawPostXML } from "../../api/raw/interface/raw-posts-xml.ts";

/** A set of the files of a post. */
export class PostFile {
    url: string;
    size: [ width: number, height: number ];

    //#region constructor
    static fromObject(object: {
        url: string;
        size: [ width: number, height: number ];
    }) {
        return new this(object);
    }
    
    constructor (option: {
        url: string;
        size: [ width: number, height: number ];
    }) {
        this.url = option.url;
        this.size = option.size;
    }
    //#endregion
}

/** The files of a post. */
export class PostFiles extends PostFile {
    static FILE_EXTENSIONS = <const> {
        Static: [ "jpeg", "jpg", "png" ],
        Animated: [ "gif" ],
        Video: [ "mp4" ]
    } satisfies {
        [K in keyof typeof PostFileType]: string[];
    };

    downsample: PostFile & { exists: boolean; };
    thumbnail: PostFile;

    type: PostFileType;
    directory: number;
    hash: string;
    extension: string;

    //#region constructor
    static fromRaw({json, xml: { attr: xml }}: {
        json: RawPostJSON;
        xml: RawPostXML;
    }) {
        return PostFiles.fromObject({
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

    static override fromObject(object: {
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
        return new PostFiles(object);
    }

    constructor (option: {
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
        super(option);
        this.downsample = <any> PostFile.fromObject(option.downsample);
        this.downsample.exists = this.url !== this.downsample.url;
        this.thumbnail = PostFile.fromObject(option.thumbnail);

        const ext = option.image.match(/(?<=\.)\w+$/)![0];

        this.type = PostFileType[
            (Object.keys(PostFiles.FILE_EXTENSIONS) as
                (keyof typeof PostFiles.FILE_EXTENSIONS)[])
            .find(key =>
                (PostFiles.FILE_EXTENSIONS[key] as string[]).includes(ext)
            )!
        ];
        // ERROR

        this.directory = option.directory;
        this.hash = option.hash;
        this.extension = ext;
    }
    //#endregion
}
