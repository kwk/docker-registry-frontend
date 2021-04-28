#!/bin/bash
set -x
set -e
cd $SOURCE_DIR
npm install
node_modules/grunt-cli/bin/grunt serve --allow-root
