import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_DB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_DB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_DB_PROJECT_ID || 'crm-cipm',
  storageBucket: process.env.NEXT_PUBLIC_DB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_DB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_DB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_DB_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
  status: string;
  firebaseId?: string;
}

interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  progress: number;
  status: string;
  completedContentIds: string[];
  lastAccessed: string;
}

interface BackupData {
  users: User[];
  enrollments: Enrollment[];
}

async function getAllFirebaseUsers() {
  const users: { uid: string; email: string }[] = [];

  console.log('📥 Fetching all Firebase users from Firestore...');

  try {
    const usersCollection = collection(db, 'Usuarios');
    const usersSnapshot = await getDocs(usersCollection);

    usersSnapshot.forEach((docSnap) => {
      const userData = docSnap.data();
      if (userData.email) {
        users.push({
          uid: docSnap.id,
          email: userData.email.toLowerCase()
        });
      }
    });

    console.log(`✅ Found ${users.length} Firebase users`);
    return users;
  } catch (error) {
    console.error('❌ Error fetching users from Firestore:', error);
    throw error;
  }
}

async function uploadMissingUsers(backupData: BackupData, dryRun: boolean = true) {
  console.log('\n👥 Starting missing users upload process...');
  console.log(`🔧 Mode: ${dryRun ? 'DRY RUN' : 'EXECUTE'}\n`);

  const usersWithoutFirebaseId = backupData.users.filter(u => !u.firebaseId);

  console.log(`📊 Total users without Firebase account: ${usersWithoutFirebaseId.length}\n`);

  if (dryRun) {
    console.log('🔍 DRY RUN - Showing first 10 users that would be created:\n');
    usersWithoutFirebaseId.slice(0, 10).forEach(user => {
      console.log(`👤 User: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log('');
    });

    console.log('ℹ️  Run with --execute flag to create these users in Firebase');
    return backupData;
  }

  // Execute upload
  console.log('🚀 Creating users in Firebase...\n');
  let successCount = 0;
  let errorCount = 0;
  const errors: { email: string; error: string }[] = [];

  for (const user of usersWithoutFirebaseId) {
    try {
      // Generate a temporary password (user should reset it)
      const tempPassword = `Temp${Math.random().toString(36).slice(-8)}!`;

      // Create user in Firebase Auth - but we can't do this with client SDK without logging in
      // Instead, we'll just create the user document in Firestore with the same ID structure

      // Create user document in Firestore
      const userDocRef = doc(db, 'Usuarios', user.id);
      const userData = {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
        createdAt: user.createdAt,
        status: user.status,
        updatedAt: new Date().toISOString()
      };

      await setDoc(userDocRef, userData);

      // Update the backup data with the Firebase ID (using the same ID)
      user.firebaseId = user.id;

      successCount++;
      console.log(`✅ [${successCount}] Created user: ${user.email}`);

      // Progress update every 50 users
      if (successCount % 50 === 0) {
        console.log(`📊 Progress: ${successCount}/${usersWithoutFirebaseId.length} users created`);
      }
    } catch (error: any) {
      errorCount++;
      errors.push({ email: user.email, error: error.message });
      console.error(`❌ Error creating user ${user.email}:`, error.message);
    }
  }

  console.log('\n📊 Upload Results:');
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);

  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.slice(0, 10).forEach(e => {
      console.log(`   - ${e.email}: ${e.error}`);
    });
    if (errors.length > 10) {
      console.log(`   ... and ${errors.length - 10} more errors`);
    }
  }

  return backupData;
}

async function matchAndUpdateUsers() {
  console.log('🔄 Starting user matching process...\n');

  // Read backup file
  const backupPath = path.join(process.cwd(), 'final-migration-data-backup.json');
  console.log(`📖 Reading backup from: ${backupPath}`);

  const backupData: BackupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
  console.log(`📊 Found ${backupData.users.length} users in backup`);
  console.log(`📊 Found ${backupData.enrollments.length} enrollments in backup\n`);

  // Get all Firebase users
  const firebaseUsers = await getAllFirebaseUsers();

  // Create email to UID map
  const emailToUid = new Map<string, string>();
  firebaseUsers.forEach(user => {
    emailToUid.set(user.email, user.uid);
  });

  // Match users and update IDs
  let matchedCount = 0;
  let notMatchedCount = 0;
  const notMatched: string[] = [];

  console.log('🔍 Matching users by email...\n');

  backupData.users.forEach((user) => {
    const email = user.email.toLowerCase();
    const firebaseUid = emailToUid.get(email);

    if (firebaseUid) {
      user.firebaseId = firebaseUid;
      matchedCount++;
      console.log(`✅ Matched: ${user.email} -> ${firebaseUid}`);
    } else {
      notMatchedCount++;
      notMatched.push(user.email);
      console.log(`❌ Not matched: ${user.email}`);
    }
  });

  console.log('\n📊 Matching Results:');
  console.log(`✅ Matched: ${matchedCount}`);
  console.log(`❌ Not matched: ${notMatchedCount}`);

  if (notMatched.length > 0) {
    console.log('\n⚠️  Users not matched:');
    notMatched.forEach(email => console.log(`   - ${email}`));
  }

  // Save updated backup
  const updatedBackupPath = path.join(process.cwd(), 'final-migration-data-backup.json');
  fs.writeFileSync(updatedBackupPath, JSON.stringify(backupData, null, 2));
  console.log(`\n💾 Updated backup saved to: ${updatedBackupPath}`);

  return backupData;
}

async function uploadEnrollments(backupData: BackupData, dryRun: boolean = true) {
  console.log('\n📚 Starting enrollment upload process...');
  console.log(`🔧 Mode: ${dryRun ? 'DRY RUN' : 'EXECUTE'}\n`);

  const enrollmentsWithFirebaseId = backupData.enrollments.filter(enrollment => {
    const user = backupData.users.find(u => u.id === enrollment.studentId);
    return user && user.firebaseId;
  });

  console.log(`📊 Total enrollments: ${backupData.enrollments.length}`);
  console.log(`✅ Enrollments with Firebase user: ${enrollmentsWithFirebaseId.length}`);
  console.log(`❌ Enrollments without Firebase user: ${backupData.enrollments.length - enrollmentsWithFirebaseId.length}\n`);

  if (dryRun) {
    console.log('🔍 DRY RUN - Showing first 5 enrollments that would be uploaded:\n');
    enrollmentsWithFirebaseId.slice(0, 5).forEach(enrollment => {
      const user = backupData.users.find(u => u.id === enrollment.studentId);
      console.log(`📝 Enrollment: ${enrollment.id}`);
      console.log(`   User: ${user?.email} (${user?.firebaseId})`);
      console.log(`   Course: ${enrollment.courseId}`);
      console.log(`   Progress: ${enrollment.progress}%`);
      console.log(`   Status: ${enrollment.status}`);
      console.log(`   Completed Content: ${enrollment.completedContentIds.length}`);
      console.log('');
    });

    console.log('ℹ️  Run with --execute flag to actually upload enrollments');
    return;
  }

  // Execute upload
  console.log('🚀 Uploading enrollments to Firebase...\n');
  let successCount = 0;
  let errorCount = 0;

  for (const enrollment of enrollmentsWithFirebaseId) {
    const user = backupData.users.find(u => u.id === enrollment.studentId);
    if (!user || !user.firebaseId) continue;

    try {
      const enrollmentData = {
        studentId: user.firebaseId,
        courseId: enrollment.courseId,
        enrollmentDate: enrollment.enrollmentDate,
        progress: enrollment.progress,
        status: enrollment.status,
        completedContentIds: enrollment.completedContentIds || [],
        lastAccessed: enrollment.lastAccessed,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'Enrollments', enrollment.id), enrollmentData);
      successCount++;
      console.log(`✅ Uploaded enrollment ${enrollment.id} for ${user.email}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Error uploading enrollment ${enrollment.id}:`, error);
    }
  }

  console.log('\n📊 Upload Results:');
  console.log(`✅ Successfully uploaded: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

async function main() {
  const args = process.argv.slice(2);
  const executeFlag = args.includes('--execute');

  try {
    // Step 1: Match existing users and update backup
    let backupData = await matchAndUpdateUsers();

    // Step 2: Upload missing users to Firebase
    backupData = await uploadMissingUsers(backupData, !executeFlag);

    // Step 3: Save updated backup with all Firebase IDs
    if (executeFlag) {
      const backupPath = path.join(process.cwd(), 'final-migration-data-backup.json');
      fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
      console.log(`\n💾 Updated backup saved with all Firebase IDs to: ${backupPath}`);
    }

    // Step 4: Upload enrollments
    await uploadEnrollments(backupData, !executeFlag);

    console.log('\n✅ Process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
