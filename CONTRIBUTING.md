# Contributing

Here are useful commands.

## Set up

* `npm install` to install dependencies.

## Developing locally

* `TARGET=firefox ./node_modules/.bin/gulp watch`
* `TARGET=chrome ./node_modules/.bin/gulp watch`

## Releasing

* Set a new version in `package.json`
* Run `./scripts/build_prod.sh`
  * A gulp task `manifest` will copy the version from `package.json` to `manifest.json`
