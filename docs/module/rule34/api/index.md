# Rule 34 API Info

The Rule 34 API allows for accessing posts, comments, and tags from rule34.xxx.

## URL

The base URL for Rule 34 API requests looks like the following:

```plain text
https://api.rule34.xxx/?page=dapi&q=index
```

> [!NOTE]
> The URL may also contain the implicit `index.php` at the end of the
> path[^na-autocomplete], which is what the official API documentation
> (unconsciously) suggests:
>
> ```plain text
> https://api.rule34.xxx/index.php?page=dapi&q=index
> ```

An additional parameter `s` should follow describing the type of data being
retrieved, such as `s=post` or `s=comment`.

The API also requires that [two additional authentication parameters] follow.

[two additional authentication parameters]: #authentication

## Authentication

All request data sent to the API is sent as URL parameters. This includes
authentication.

Requests must have two extra parameters: `api_key` and
`user_id`[^na-autocomplete]. If authentication is invalid, you will always get
the following response[^formatted]:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<error>
  Missing authentication. Go to api.rule34.xxx for more information
</error>
```

> [!TIP]
> Beware that, because of the length of API keys, API URLs tend to be very
> lengthy. It is recommended practice to use utilities and functions to convert
> easier-legible objects to URLs.

### Usage and Limits

> [!IMPORTANT]
> This section rewrites that of the official documentation in attempt to improve
> comprehensibility, and covers important details regarding API usage and
> contacting support.
>
> As the expressed intentions or rules may be inaccurate or outdated at any
> time, it is critical that you view [the original documentation] before
> acting on the following section, such as contacting staff or making
> excessive use of a key. I have appended footnotes clarifying ambiguity of
> important keywords or phrases.
>
> I, "chiptumor", should not be held responsible for inappropriate usage of the
> Rule 34 API nor damages to or damages via any contact methods provided below.

[the original documentation]: <https://api.rule34.xxx/>

API keys are created with initial rate limits[^NC-default-limit]. This limit
may be changed at any time.

If usage of your key's application is expected to exceed the limit, you may
contact staff to request for the limit to be unlocked. This may only be applied
to large, public projects.

If the application is significantly used and the need for a rate limit increase
is urgent, you may contact staff by making a ticket on the
[official Discord server]. Alternatively, you may also contact staff via site
mail (see [_Rule 34 - Contact staff info here_])[^NC-staff-contact].

Staff reserve the right to disable any key or deny any request to bump your rate
limit.

[official Discord server]: <https://discord.gg/rule34xxx>

[_Rule 34 - Contact staff info here_]: <https://rule34.xxx/index.php?page=forum&s=view&id=4240>

#### API Rules

- You are not to use more than one API key[^NC-multiple-keys]. Implicitly, you
  are not to request a rate limit increase for more than one
  key[^NC-multiple-keys]. Violating this rule will result in a suspension of
  your key and possibly your account[^NC-account-suspension].
- Applications of the API or CDN are not to provide profit via advertisements or
  paywalls. This is applicable to any kind of usage, e.g. a website or Discord
  bot.

## Server

When using the API properly, you should never receive an error unless the server
is overloaded or the search dies (needs clarification[^NC-search-break]). When
the server _does_ break, you will receive a response success of "false" and a
message stating something along the lines of "search down" (needs
clarification[^NC-failed-response]).

[^na-autocomplete]: This rule does not apply to the API's tag search
  autocompletion endpoint.

[^formatted]: The sample is formatted for legibility. The actual result should
  differ.

[^NC-default-limit]: It is unknown what the initial API rate limit is.

[^NC-staff-contact]: It is uncertain what circumstances allow for what staff
  contact methods. It is assumed staff may be contacted for a rate limit
  increase regardless of urgency.

[^NC-multiple-keys]: It is unknown whether only one key is allowed _per project_
  or _per person._ It is implicit that only one key may be used per person, but
  it may be reasonably assumed that one key per project is permitted.

[^NC-account-suspension]: It is unknown what circumstances may lead to account
  suspension in addition to a key suspension.

[^NC-search-break]: It is uncertain what circumstances may cause a search to
  die, nor is it certain what a search "dying" means.

[^NC-failed-response]: It is unknown what this response may look like. The
  official documentation doesn't suggest what a "response success of 'false'
  with a message" means, nor does it say explicitly what the message is.
