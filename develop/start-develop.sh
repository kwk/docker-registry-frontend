#!/bin/bash
set -x
set -e
cd $SOURCE_DIR
npm install
node_modules/bower/bin/bower install --allow-root
node_modules/grunt-cli/bin/grunt serve --allow-root
