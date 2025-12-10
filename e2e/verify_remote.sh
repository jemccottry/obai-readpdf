#!/bin/bash
# URL provided by user
TARGET_URL="https://mutual-cecilla-jmccottry-33ae7687.koyeb.app/api/readpdf/bulk"
TEST_DIR="/Users/jeddy/Documents/obai/services/obai-readpdf/obai-readpdf/test"

echo "Using target: $TARGET_URL"
echo "Preparing bulk upload (5 files)..."

FILES=""
count=0
# Loop through files and pick first 5
for f in "$TEST_DIR"/*.pdf; do
  if [ -f "$f" ]; then
    FILES="$FILES -F files=@$f"
    count=$((count + 1))
    if [ $count -ge 5 ]; then
      break
    fi
  fi
done

echo "Selected $count files."

# Using the previously known API key
curl -X POST "$TARGET_URL" \
  -H "x-api-key: $1" \
  $FILES \
  -F "comment=Remote Bulk Verification" \
  -v
