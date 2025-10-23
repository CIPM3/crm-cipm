import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
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

async function updateStudentRoles(dryRun: boolean = true) {
  console.log('🔄 Starting role update process...');
  console.log(`🔧 Mode: ${dryRun ? 'DRY RUN' : 'EXECUTE'}\n`);

  try {
    // Get all users from Firestore
    console.log('📥 Fetching all users from Firestore...');
    const usersCollection = collection(db, 'Usuarios');
    const usersSnapshot = await getDocs(usersCollection);

    console.log(`✅ Found ${usersSnapshot.size} users\n`);

    // Filter users with role "student"
    const studentsToUpdate: { id: string; name: string; email: string }[] = [];

    usersSnapshot.forEach((docSnap) => {
      const userData = docSnap.data();
      if (userData.role === 'student') {
        studentsToUpdate.push({
          id: docSnap.id,
          name: userData.name,
          email: userData.email
        });
      }
    });

    console.log(`📊 Users with role "student": ${studentsToUpdate.length}\n`);

    if (studentsToUpdate.length === 0) {
      console.log('ℹ️  No users with role "student" found.');
      return;
    }

    if (dryRun) {
      console.log('🔍 DRY RUN - Users that would be updated:\n');
      studentsToUpdate.slice(0, 10).forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`);
      });

      if (studentsToUpdate.length > 10) {
        console.log(`... and ${studentsToUpdate.length - 10} more users\n`);
      }

      console.log(`\nℹ️  Total: ${studentsToUpdate.length} users would be updated from role "student" to "cliente"`);
      console.log('ℹ️  Run with --execute flag to perform the update');
      return;
    }

    // Execute update
    console.log('🚀 Updating user roles...\n');
    let successCount = 0;
    let errorCount = 0;

    for (const user of studentsToUpdate) {
      try {
        const userDocRef = doc(db, 'Usuarios', user.id);
        await updateDoc(userDocRef, {
          role: 'cliente',
          updatedAt: new Date().toISOString()
        });

        successCount++;
        console.log(`✅ [${successCount}] Updated: ${user.name} (${user.email})`);

        // Progress update every 50 users
        if (successCount % 50 === 0) {
          console.log(`📊 Progress: ${successCount}/${studentsToUpdate.length} users updated`);
        }
      } catch (error: any) {
        errorCount++;
        console.error(`❌ Error updating ${user.email}:`, error.message);
      }
    }

    console.log('\n📊 Update Results:');
    console.log(`✅ Successfully updated: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const executeFlag = args.includes('--execute');

  try {
    await updateStudentRoles(!executeFlag);
    console.log('\n✅ Process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
