#!/bin/bash
TEST_DIR="/Users/jeddy/Documents/obai/services/obai-readpdf/obai-readpdf/test"
echo "Preparing small bulk upload (4 files)..."

FILES=""
count=0
# Loop through files and pick first 4
for f in "$TEST_DIR"/*.pdf; do
  if [ -f "$f" ]; then
    FILES="$FILES -F files=@$f"
    count=$((count + 1))
    if [ $count -ge 4 ]; then
      break
    fi
  fi
done

echo "Selected $count files."

curl -X POST http://localhost:3000/api/readpdf/bulk \
  -H "x-api-key: $1" \
  $FILES \
  -F "comment=Small Bulk Verification" \
  -v
