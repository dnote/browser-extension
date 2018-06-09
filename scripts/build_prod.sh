#!/bin/bash

# build_prod.sh builds distributable archive for the addon

# TODO: automate version bump in /manifests/{target}
# and package.json (although package.json version is not used anywhere)

# clean
TARGET=chrome gulp clean
TARGET=firefox gulp clean

# build and package chrome
NODE_ENV=production TARGET=chrome gulp
TARGET=chrome gulp package

# firefox
NODE_ENV=production TARGET=firefox gulp
TARGET=firefox gulp package
