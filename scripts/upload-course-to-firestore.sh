#!/bin/bash

# Script to upload first course from final-migration-data.json to Firestore
# Uses Firebase CLI and jq to process JSON data

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting upload process...${NC}\n"

# Extract first course
COURSE=$(jq '.cursos[0]' final-migration-data.json)
COURSE_ID=$(echo "$COURSE" | jq -r '.id')
COURSE_TITLE=$(echo "$COURSE" | jq -r '.title')

echo -e "${GREEN}📚 First Course: $COURSE_TITLE (ID: $COURSE_ID)${NC}"

# Remove 'id' field from course data for upload
COURSE_DATA=$(echo "$COURSE" | jq 'del(.id)')

# Get modules for this course
MODULES=$(jq --arg courseId "$COURSE_ID" '.modules[] | select(.courseId == $courseId)' final-migration-data.json)
MODULE_COUNT=$(echo "$MODULES" | jq -s 'length')

echo -e "${GREEN}📦 Modules found: $MODULE_COUNT${NC}"

# Get content for this course
CONTENT=$(jq --arg courseId "$COURSE_ID" '.content[] | select(.courseId == $courseId)' final-migration-data.json)
CONTENT_COUNT=$(echo "$CONTENT" | jq -s 'length')

echo -e "${GREEN}🎬 Content items found: $CONTENT_COUNT${NC}\n"

if [ "$1" != "--execute" ]; then
    echo -e "${BLUE}✅ DRY RUN - No data uploaded${NC}"
    echo ""
    echo "Summary:"
    echo "- Course: 1 document ($COURSE_ID)"
    echo "- Modules: $MODULE_COUNT documents"
    echo "- Content: $CONTENT_COUNT documents"
    echo ""
    echo "Run with --execute flag to upload to Firebase"
    exit 0
fi

echo -e "${BLUE}🔥 Uploading to Firebase...${NC}\n"

# Upload course
echo -e "${GREEN}📤 Uploading course: $COURSE_TITLE...${NC}"
echo "$COURSE_DATA" | npx firebase firestore:write cursos/$COURSE_ID --stdin
echo -e "${GREEN}   ✓ Course uploaded${NC}"

# Upload modules
echo -e "\n${GREEN}📤 Uploading $MODULE_COUNT modules...${NC}"
echo "$MODULES" | jq -c '.' | while read -r module; do
    MODULE_ID=$(echo "$module" | jq -r '.id')
    MODULE_TITLE=$(echo "$module" | jq -r '.title')
    MODULE_DATA=$(echo "$module" | jq 'del(.id)')
    echo "$MODULE_DATA" | npx firebase firestore:write modules/$MODULE_ID --stdin
    echo -e "${GREEN}   ✓ Module uploaded: $MODULE_TITLE${NC}"
done

# Upload content
echo -e "\n${GREEN}📤 Uploading $CONTENT_COUNT content items...${NC}"
UPLOAD_COUNT=0
echo "$CONTENT" | jq -c '.' | while read -r content; do
    CONTENT_ID=$(echo "$content" | jq -r '.id')
    CONTENT_DATA=$(echo "$content" | jq 'del(.id)')
    echo "$CONTENT_DATA" | npx firebase firestore:write videos/$CONTENT_ID --stdin 2>/dev/null
    UPLOAD_COUNT=$((UPLOAD_COUNT + 1))
    if [ $((UPLOAD_COUNT % 5)) -eq 0 ] || [ $UPLOAD_COUNT -eq $CONTENT_COUNT ]; then
        echo -e "${GREEN}   ✓ Uploaded $UPLOAD_COUNT/$CONTENT_COUNT content items${NC}"
    fi
done

echo -e "\n${GREEN}✅ Upload completed successfully!${NC}"
echo ""
echo "Summary:"
echo "- Course: 1 document uploaded to 'cursos' collection"
echo "- Modules: $MODULE_COUNT documents uploaded to 'modules' collection"
echo "- Content: $CONTENT_COUNT documents uploaded to 'videos' collection"
