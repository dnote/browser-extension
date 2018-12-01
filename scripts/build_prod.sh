#!/bin/bash

# build_prod.sh builds distributable archive for the addon
# remember to bump version in package.json

# clean
TARGET=chrome ./node_modules/.bin/gulp clean
TARGET=firefox ./node_modules/.bin/gulp clean

# build and package chrome
NODE_ENV=PRODUCTION TARGET=chrome ./node_modules/.bin/gulp
TARGET=chrome ./node_modules/.bin/gulp package

# firefox
NODE_ENV=PRODUCTION TARGET=firefox ./node_modules/.bin/gulp
TARGET=firefox ./node_modules/.bin/gulp package
