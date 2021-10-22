#!/usr/bin/env sh

esbuild ./src/index.tsx \
    --outfile=./bin/index.js \
    --bundle \
    --platform=node \
    --external:ink \
    --external:node-abort-controller \
    --external:node-fetch \
    --external:open \
    --external:react \
    --sourcemap \
    --minify
