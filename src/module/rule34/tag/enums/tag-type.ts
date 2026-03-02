/** The possible types of a tag. */
export enum TagType {
    /**
     * A copyright, such as a series, brand, or franchise.
     */
    Copyright,
    /**
     * A character, or a cover for a vaguer character description.
     */
    Character,
    /**
     * An artist alias, a reason for lack of such tags, or a call for help with
     * crediting artists involved (e.g. `unknown_artist` or `artist_request`).
     */
    Artist,
    /**
     * Any tag that may not fit any of the other categories, e.g. a visual,
     * activity, or interest.
     */
    General,
    /**
     * Image metadata, content qualities (e.g. sound), or a call for help (e.g.
     * `tagme`).
     */
    Metadata,
    /**
     * A tag whose type isn't certain yet.
     */
    Ambiguous
}
