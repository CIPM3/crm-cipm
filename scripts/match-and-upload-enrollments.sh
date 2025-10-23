#!/bin/bash

# Script to match users and upload enrollments from final-migration-data-backup.json
# Uses Firebase CLI and jq to process JSON data

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting user matching and enrollment upload process...${NC}\n"

# Temporary files
FIREBASE_USERS_FILE="temp_firebase_users.json"
UPDATED_BACKUP_FILE="final-migration-data-backup-updated.json"
BACKUP_FILE="final-migration-data-backup.json"

# Step 1: Fetch all users from Firebase
echo -e "${BLUE}📥 Fetching users from Firebase Firestore...${NC}"

# Use Firebase CLI to get all users from Firestore
npx firebase firestore:get users --project crm-cipm --format json > "$FIREBASE_USERS_FILE" 2>/dev/null

if [ ! -s "$FIREBASE_USERS_FILE" ]; then
    echo -e "${RED}❌ Failed to fetch users from Firebase${NC}"
    rm -f "$FIREBASE_USERS_FILE"
    exit 1
fi

FIREBASE_USER_COUNT=$(jq 'length' "$FIREBASE_USERS_FILE")
echo -e "${GREEN}✅ Found $FIREBASE_USER_COUNT users in Firebase${NC}\n"

# Step 2: Match users and update backup
echo -e "${BLUE}🔍 Matching users by email...${NC}\n"

BACKUP_USER_COUNT=$(jq '.users | length' "$BACKUP_FILE")
ENROLLMENT_COUNT=$(jq '.enrollments | length' "$BACKUP_FILE")

echo -e "${GREEN}📊 Backup file contains:${NC}"
echo -e "   - ${BACKUP_USER_COUNT} users"
echo -e "   - ${ENROLLMENT_COUNT} enrollments\n"

# Create a mapping script in jq
cat > temp_match.jq <<'EOF'
# Create email to Firebase ID mapping from Firebase users
.firebaseUsers as $fbUsers |
.backup.users as $backupUsers |

# Create mapping
($fbUsers | map({(.email | ascii_downcase): .id}) | add) as $emailToId |

# Update backup users with Firebase IDs
.backup.users = ($backupUsers | map(
  . + {
    firebaseId: ($emailToId[.email | ascii_downcase] // null)
  }
)) |

# Return only the backup data
.backup
EOF

# Combine data and run jq
jq -n \
  --slurpfile firebaseUsers "$FIREBASE_USERS_FILE" \
  --slurpfile backup "$BACKUP_FILE" \
  '{firebaseUsers: $firebaseUsers[0], backup: $backup[0]}' | \
  jq -f temp_match.jq > "$UPDATED_BACKUP_FILE"

# Count matches
MATCHED_COUNT=$(jq '[.users[] | select(.firebaseId != null)] | length' "$UPDATED_BACKUP_FILE")
NOT_MATCHED_COUNT=$(jq '[.users[] | select(.firebaseId == null)] | length' "$UPDATED_BACKUP_FILE")

echo -e "${GREEN}📊 Matching Results:${NC}"
echo -e "   ✅ Matched: ${MATCHED_COUNT}"
echo -e "   ❌ Not matched: ${NOT_MATCHED_COUNT}\n"

# Show some not matched users
if [ "$NOT_MATCHED_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  First 10 users not matched:${NC}"
    jq -r '[.users[] | select(.firebaseId == null) | .email] | .[:10] | .[]' "$UPDATED_BACKUP_FILE" | while read email; do
        echo -e "   - $email"
    done
    echo ""
fi

# Save updated backup
cp "$BACKUP_FILE" "${BACKUP_FILE}.original"
cp "$UPDATED_BACKUP_FILE" "$BACKUP_FILE"
echo -e "${GREEN}💾 Updated backup saved to: ${BACKUP_FILE}${NC}"
echo -e "${GREEN}💾 Original backup saved to: ${BACKUP_FILE}.original${NC}\n"

# Step 3: Upload enrollments
ENROLLMENTS_WITH_FIREBASE_ID=$(jq '[.enrollments[] as $e | .users[] | select(.id == $e.userId and .firebaseId != null) | $e] | length' "$UPDATED_BACKUP_FILE")
ENROLLMENTS_WITHOUT_FIREBASE_ID=$(jq '[.enrollments[] as $e | .users[] | select(.id == $e.userId and .firebaseId == null) | $e] | length' "$UPDATED_BACKUP_FILE")

echo -e "${GREEN}📚 Enrollment Analysis:${NC}"
echo -e "   ✅ Enrollments with Firebase user: ${ENROLLMENTS_WITH_FIREBASE_ID}"
echo -e "   ❌ Enrollments without Firebase user: ${ENROLLMENTS_WITHOUT_FIREBASE_ID}\n"

if [ "$1" != "--execute" ]; then
    echo -e "${BLUE}✅ DRY RUN - No enrollments uploaded${NC}\n"

    echo -e "${BLUE}📋 First 5 enrollments that would be uploaded:${NC}\n"

    # Show first 5 enrollments
    jq -r '.users as $users | .enrollments[:5][] |
        . as $enrollment |
        ($users[] | select(.id == $enrollment.userId)) as $user |
        "📝 Enrollment: \($enrollment.id)
   User: \($user.email) (\($user.firebaseId // "NO FIREBASE ID"))
   Course: \($enrollment.courseId)
   Progress: \($enrollment.progress)%
   Status: \($enrollment.status)
   Completed Lessons: \($enrollment.completedLessons | length)
"' "$UPDATED_BACKUP_FILE"

    echo -e "${YELLOW}ℹ️  Run with --execute flag to upload enrollments to Firebase${NC}"

    # Cleanup
    rm -f "$FIREBASE_USERS_FILE" "$UPDATED_BACKUP_FILE" temp_match.jq
    exit 0
fi

# Execute upload
echo -e "${BLUE}🔥 Uploading enrollments to Firebase...${NC}\n"

SUCCESS_COUNT=0
ERROR_COUNT=0

# Create enrollments data and upload
jq -c '.users as $users | .enrollments[] |
    . as $enrollment |
    ($users[] | select(.id == $enrollment.userId and .firebaseId != null)) as $user |
    {
        id: $enrollment.id,
        data: {
            userId: $user.firebaseId,
            courseId: $enrollment.courseId,
            enrolledAt: $enrollment.enrolledAt,
            progress: $enrollment.progress,
            status: $enrollment.status,
            completedLessons: ($enrollment.completedLessons // []),
            lastAccessedAt: $enrollment.lastAccessedAt,
            updatedAt: (now | todate)
        }
    }' "$UPDATED_BACKUP_FILE" | while read -r enrollment_json; do

    ENROLLMENT_ID=$(echo "$enrollment_json" | jq -r '.id')
    ENROLLMENT_DATA=$(echo "$enrollment_json" | jq '.data')
    USER_EMAIL=$(jq -r --arg id "$ENROLLMENT_ID" '.users as $users | .enrollments[] | select(.id == $id) as $e | ($users[] | select(.id == $e.userId) | .email)' "$UPDATED_BACKUP_FILE")

    # Upload to Firebase
    if echo "$ENROLLMENT_DATA" | npx firebase firestore:write "enrollments/$ENROLLMENT_ID" --stdin --project crm-cipm 2>/dev/null; then
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        echo -e "${GREEN}✅ [$SUCCESS_COUNT] Uploaded enrollment for: $USER_EMAIL${NC}"
    else
        ERROR_COUNT=$((ERROR_COUNT + 1))
        echo -e "${RED}❌ [$ERROR_COUNT] Failed to upload enrollment $ENROLLMENT_ID${NC}"
    fi

    # Progress update every 50 enrollments
    TOTAL_PROCESSED=$((SUCCESS_COUNT + ERROR_COUNT))
    if [ $((TOTAL_PROCESSED % 50)) -eq 0 ]; then
        echo -e "${BLUE}📊 Progress: $TOTAL_PROCESSED enrollments processed${NC}"
    fi
done

echo -e "\n${GREEN}✅ Upload completed!${NC}\n"
echo -e "${GREEN}📊 Final Results:${NC}"
echo -e "   ✅ Successfully uploaded: ${SUCCESS_COUNT}"
echo -e "   ❌ Errors: ${ERROR_COUNT}"

# Cleanup
rm -f "$FIREBASE_USERS_FILE" "$UPDATED_BACKUP_FILE" temp_match.jq

echo -e "\n${BLUE}🎉 Process completed successfully!${NC}"
