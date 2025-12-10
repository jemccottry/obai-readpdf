#!/bin/bash
API_KEY="test-api-key"
# Retrieve the API key from .env if possible, or use a placeholder if we can't parse it easily in bash.
# Assuming we can just grep it or the user provided it (I need to check .env or main.ts logic).
# main.ts checks configService.apiKey. 
# construct curl command

echo "Preparing bulk upload..."

FILES=""
TEST_DIR="/Users/jeddy/Documents/obai/services/obai-readpdf/obai-readpdf/test"

# Debug: verify files exist
ls -la "$TEST_DIR"

# Construct argument string
for f in "$TEST_DIR"/*.pdf; do
  FILES="$FILES -F files=@$f"
done

echo "Command args: $FILES"

curl -X POST http://localhost:3000/api/readpdf/bulk \
  -H "x-api-key: $1" \
  $FILES \
  -F "comment=Verification Bulk Upload" \
  -v
