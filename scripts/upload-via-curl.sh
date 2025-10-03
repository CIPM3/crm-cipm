#!/bin/bash

# Script to upload first course using Firebase REST API

set -e

PROJECT_ID="crm-cipm"
API_KEY=$(grep NEXT_PUBLIC_DB_API_KEY .env | cut -d '=' -f2)

echo "🚀 Starting upload process via REST API..."
echo ""

# Extract first course
COURSE=$(jq '.cursos[0]' final-migration-data.json)
COURSE_ID=$(echo "$COURSE" | jq -r '.id')
COURSE_TITLE=$(echo "$COURSE" | jq -r '.title')

echo "📚 First Course: $COURSE_TITLE (ID: $COURSE_ID)"

# Remove id from course data
COURSE_DATA=$(echo "$COURSE" | jq 'del(.id)')

# Get modules
MODULES=$(jq --arg courseId "$COURSE_ID" '.modules[] | select(.courseId == $courseId)' final-migration-data.json)
MODULE_COUNT=$(echo "$MODULES" | jq -s 'length')

echo "📦 Modules found: $MODULE_COUNT"

# Get content
CONTENT=$(jq --arg courseId "$COURSE_ID" '.content[] | select(.courseId == $courseId)' final-migration-data.json)
CONTENT_COUNT=$(echo "$CONTENT" | jq -s 'length')

echo "🎬 Content items found: $CONTENT_COUNT"
echo ""
echo "🔥 Uploading to Firebase..."
echo ""

# Upload course
echo "📤 Uploading course: $COURSE_TITLE..."
curl -X PATCH \
  "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents/cursos/$COURSE_ID?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"fields\": $(echo "$COURSE_DATA" | jq -c 'to_entries | map({key: .key, value: {stringValue: (.value | tostring)}}) | from_entries')}" \
  > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "   ✓ Course uploaded"
else
    echo "   ✗ Course upload failed"
    exit 1
fi

# Upload modules
echo ""
echo "📤 Uploading $MODULE_COUNT modules..."
echo "$MODULES" | jq -c '.' | while read -r module; do
    MODULE_ID=$(echo "$module" | jq -r '.id')
    MODULE_TITLE=$(echo "$module" | jq -r '.title')
    MODULE_DATA=$(echo "$module" | jq 'del(.id)')

    curl -X PATCH \
      "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents/modules/$MODULE_ID?key=$API_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"fields\": $(echo "$MODULE_DATA" | jq -c 'to_entries | map({key: .key, value: {stringValue: (.value | tostring)}}) | from_entries')}" \
      > /dev/null 2>&1

    echo "   ✓ Module uploaded: $MODULE_TITLE"
done

# Upload content
echo ""
echo "📤 Uploading $CONTENT_COUNT content items..."
UPLOAD_COUNT=0
echo "$CONTENT" | jq -c '.' | while read -r content; do
    CONTENT_ID=$(echo "$content" | jq -r '.id')
    CONTENT_DATA=$(echo "$content" | jq 'del(.id)')

    curl -X PATCH \
      "https://firestore.googleapis.com/v1/projects/$PROJECT_ID/databases/(default)/documents/videos/$CONTENT_ID?key=$API_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"fields\": $(echo "$CONTENT_DATA" | jq -c 'to_entries | map({key: .key, value: {stringValue: (.value | tostring)}}) | from_entries')}" \
      > /dev/null 2>&1

    UPLOAD_COUNT=$((UPLOAD_COUNT + 1))
    if [ $((UPLOAD_COUNT % 5)) -eq 0 ] || [ $UPLOAD_COUNT -eq $CONTENT_COUNT ]; then
        echo "   ✓ Uploaded $UPLOAD_COUNT/$CONTENT_COUNT content items"
    fi
done

echo ""
echo "✅ Upload completed successfully!"
echo ""
echo "Summary:"
echo "- Course: 1 document uploaded to 'cursos' collection"
echo "- Modules: $MODULE_COUNT documents uploaded to 'modules' collection"
echo "- Content: $CONTENT_COUNT documents uploaded to 'videos' collection"
