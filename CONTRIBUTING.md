# Contributing

Here are useful commands.

## Developing locally

* `TARGET=firefox gulp watch`
* `TARGET=chrome gulp watch`

## Releasing

* Set a new version in `package.json`
* Run `./scripts/build_prod.sh`
  * A gulp task `manifest` will copy the version from `package.json` to `manifest.json`
