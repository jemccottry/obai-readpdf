#!/bin/bash

TEST_FILE="/Users/jeddy/Documents/obai/services/obai-readpdf/obai-readpdf/test/01.pdf"

echo "Verifying Single Upload with $TEST_FILE"

curl -X POST http://localhost:3000/api/readpdf \
  -H "x-api-key: $1" \
  -F "file=@$TEST_FILE" \
  -F "comment=Single upload test" \
  -v
