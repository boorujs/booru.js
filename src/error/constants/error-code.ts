let concatenate = ((joiner: string, ...items: any[]) => items.join(joiner));
let concat = {
    line: (...items: any[]) => concatenate("\n", ...items),
    space: (...items: any[]) => concatenate(" ", ...items)
};

type ERROR_CODE = { readonly [K in ErrorCode]: ErrorMessageFunction; };
type ErrorMessageFunction = (...args: any[]) => {
    message: string;
    hint?: string;
    issue?: boolean;
};

export type ErrorCode = keyof typeof ERROR_CODE_LITERAL;

export const ERROR_ISSUE_MESSAGE = <const>
    "If you've come across this error naturally, please file an issue on GitHub with the applicable info.";

const ERROR_CODE_LITERAL = <const> {
    //#region core
    _TEMP: (reason: string, args: { [K: string]: any; }) => ({
        message: concat.line(
            "This is a valid error whose message hasn't been defined yet.",
            `Case: ${reason}`,
            `Arguments: ${JSON.stringify(args, null, 2)}`
        ),
        hint: concat.space(
            "This means that this error case has been considered, but the",
            "message wasn't properly implemented before release."
        ),
        issue: true
    }),
    _TEST_ERROR: (...args: any[]) => ({
        message: concat.line(
            "This is a test error.",
            `Arguments: ${args.length ? args.join(", ") : "none"}`
        ),
        hint: concat.space(
            "You should not see this error thrown; this error type only exists",
            "to test the functionality of errors."
        ),
        issue: true
    }),

    //#region auth
    INVALID_AUTH: () => ({
        message: "Authentication is invalid.",
        hint: "Be sure you've provided the correct and necessary credentials."
    }),

    //#region RULE34
    RULE34_NO_AUTH_RESPONSE_DATA: () => ({
        message: "An empty response was returned from api.rule34.xxx.",
        hint: concat.line( 
            concat.space(
                "Rule 34's API returned a data-less response. This likely means",
                "that Rule 34's main server is currently down for maintenance.",
                "It is recommended by their staff to check their Discord",
                "server for more information."
            ),
            concat.space(
                "This may also have happened for another reason; check the",
                "site for a big, red banner at the top that says similar. If",
                "there's no evidence that their main server is down, _please_",
                "file an issue on GitHub with all the info you can gather."
            )
        )
    }),
    RULE34_UNEXPECTED_AUTH_RESPONSE: (response: string) => ({
        message: "Unexpected response when validating authentication.",
        hint: concat.line(
            "An unknown response was given when validating credentials.",
            `Response:\n${response}`
        ),
        issue: true
    })
} satisfies {
    readonly [K: string]: (...args: any[]) => {
        message: string;
        hint?: string;
        issue?: boolean;
    };
};

export const ERROR_CODE = ERROR_CODE_LITERAL as ERROR_CODE;
