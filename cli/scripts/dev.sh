#!/usr/bin/env sh

esbuild ./src/index.tsx \
    --outfile=./bin/index.js \
    --platform=node \
    --bundle \
    --external:axios \
    --external:ink \
    --external:open \
    --external:react \
    --watch
