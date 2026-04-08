/** The base abstract tag. */
export abstract class BaseTag {
    /** The name and value of the tag. */
    abstract name: string;
    /** The amount of posts that use this tag. */
    abstract count: number;
}
