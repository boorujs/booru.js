import { ERROR_CODE, ERROR_ISSUE_MESSAGE, type ErrorCode } from "../constants/error-code.ts";

export class BoorujsError extends Error {
    /** The unique error code. */
    code: ErrorCode;
    /** The hint explaining the error. */
    hint: string | undefined;
    /** Whether the error should be reported. */
    issue: boolean;

    //#region constructor
    static throw(
        ...args: ConstructorParameters<typeof BoorujsError>
    ): never {
        throw new this(...args);
    }

    constructor (
        code: ErrorCode,
        args: Parameters<typeof ERROR_CODE[typeof code]> = []
    ) {
        const errorCode = ERROR_CODE[code](...args);

        super(errorCode.message);
        this.name = this.constructor.name;
        this.code = code;
        this.hint = errorCode.hint;
        this.issue = errorCode.issue ?? false;
    }
    //#endregion
    
    override toString(): string {
        return Error.prototype.toString.call({
            name: `${this.name}(${this.code})`,
            message: [
                this.message,
                this.hint,
                this.issue && ERROR_ISSUE_MESSAGE
            ].filter(i => !!i).join("\n")
        });
    }
}
