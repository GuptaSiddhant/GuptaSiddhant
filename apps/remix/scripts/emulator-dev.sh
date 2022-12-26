#! /usr/bin/env sh

FIRESTORE_EMULATOR_HOST="localhost:8080" \
    FIREBASE_STORAGE_EMULATOR_HOST="localhost:9199" \
    FIREBASE_AUTH_EMULATOR_HOST="localhost:9099" \
    remix dev
