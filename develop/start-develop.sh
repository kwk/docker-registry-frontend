#!/bin/bash
set -x
set -e
cd $SOURCE_DIR
npm install
bower install --allow-root
grunt serve --allow-root
