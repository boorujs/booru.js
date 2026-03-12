# To-Do

- Find out when a Rule 34 API search breaks[^1]
  - Find out what a failed response looks like[^2]
  - Test broken searches with different return types[^2]
- Do something with following info about Rule 34:
  - On 3/12/2026, rule34.xxx had a red banner with the following:
    > Our main server is currently down for maintenance. When you're back on our
    > main server this ugly red bar will dissapear. For more info check discord.
    > This server is READ-only and no posting/edits can be made.
  - During this time, the API occasionally sent an empty response in place of
    any response otherwise, except when authentication was invalid---it would
    still respond with the usual "missing authentication" error.

[^1]: From [_Rule 34 API Info_]: "It is uncertain what circumstances may cause a
  [Rule 34 API] search to die."

[^2]: From [_Rule 34 API Info_]: "It is uncertain what [a failed] response may
  look like. The official [Rule 34 API] documentation doesn't elaborate what a
  'response success of 'false' with a message' means, nor does it say explicitly
  what the message is."

[_Rule 34 API Info_]: <./rule34/api/index.md>
