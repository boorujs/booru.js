# Rule 34 API Info

The Rule 34 API allows for accessing posts, comments, and tags from rule34.xxx.

> [!TIP]
> The only API requests excluded from the following documentation are
> autocompletion requests.

## URL

The base URL for Rule 34 API requests looks like the following:

```plain text
https://api.rule34.xxx/?page=dapi&q=index
```

> [!NOTE]
> The URL may also contain the implicit `index.php` at the end of the path,
> which is what the official API documentation (unconsciously) suggests:
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

> [!TIP]
> The only exception to requiring authentication for the API is fetching
> autocomplete results.

Requests must have two extra parameters, those being `api_key` and
`user_id`. If authentication is invalid, you will always get the following
response:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<error>
  Missing authentication. Go to api.rule34.xxx for more information
</error>
```

> [!NOTE]
> The preceding sample is formatted for better readability, but the actual
> response is formatted differently.

Beware that, because of the length of API keys, API URLs tend to look very
lengthy. It is recommended practice to use utilities and functions to convert
objects to URLs.

## Server

When using the API properly, you should never receive an error unless the server
is overloaded or the search dies. When the server _does_ break, you will receive
a response success of "false" and a message stating something along the lines of
"search down."

> [!IMPORTANT]
> > When the server _does_ break ... something along the lines of "search down."
>
> The official documentation does not provide examples of what a failed search
> looks like.
>
> <details><summary>To-do</summary>
>
> ```markdown
> # TODO
>   - Find out when a search breaks
>     - Test broken searches with different return types
>   - Find out what a failed response looks like
> ```
>
> </details>
