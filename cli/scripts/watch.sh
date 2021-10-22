#!/usr/bin/env sh

esbuild ./src/index.tsx \
    --outfile=./bin/index.js \
    --bundle \
    --platform=node \
    --external:axios \
    --external:ink \
    --external:open \
    --external:react \
    --watch
