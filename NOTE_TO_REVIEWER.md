## Notes to Reviewer

This README contains instructions about how to reproduce the final build of this extension.

All releases are tagged and pushed to [the GitHub repository](https://github.com/dnote-io/browser-extension).

### Firefox

To reproduce the obfuscated code for Firefox, please follow the steps below.

1.  Run `yarn` to install dependencies
2.  Run `NODE_ENV=PRODUCTION TARGET=firefox gulp`

The obfuscated code will be under `/dist/firefox`.

### Further questions

Please contact sung@dnote.io
