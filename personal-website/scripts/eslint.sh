#!/bin/bash

# a pre-commit hook, used in personal-website/pre-commit-config.yaml

cd personal-website
tf=tempfile
npm run lint -- -o $tf --format compact
lines=$(wc -l < $tf)
rm $tf
if [ "$lines" -ne 0 ]; then
    exit 1
fi
