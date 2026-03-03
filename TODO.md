# To-do

## Elsewhere

- Add error safeguards for Rule 34 API
  > You'd be surprised just how god-awful it can be to you.

## Home

- **TS Compilation:**
  1. Figure out how to compile to both `.cjs` and `.mjs`
  2. Figure out the directories of `.cjs`, `.mjs`, and `.d.ts`
  * Links:
    - [Stack Overflow -- How to support es modules and commonjs modules at the
      same time]
  * Samples:
    - From [ESM>CDN: How to Use]:
      ```json
      "exports": {
        ".": {
          "import": "./dist/mjs/index.js",
          "require": "./dist/cjs/index.js",
          "types": "./dist/types/index.d.ts"
        },
        "./rule34": {
          "import": "./dist/mjs/module/rule34/index.js",
          "require": "./dist/cjs/module/rule34/index.js",
          "types": "./dist/types/module/rule34/index.d.ts"
        }
      },
      ```

[Stack Overflow -- How to support es modules and commonjs modules at the same
time]:
  <https://stackoverflow.com/questions/74937600/>
[ESM>CDN: How to Use]:
  <https://esm.sh/#:~:text=define%20the%20exports%20field>
