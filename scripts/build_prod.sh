#!/bin/bash

# build_prod.sh builds distributable archive for the addon
# remember to bump version in package.json

# clean
TARGET=chrome gulp clean
TARGET=firefox gulp clean

# build and package chrome
NODE_ENV=PRODUCTION TARGET=chrome gulp
TARGET=chrome gulp package

# firefox
NODE_ENV=PRODUCTION TARGET=firefox gulp
TARGET=firefox gulp package
