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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Usuario {
  id: string;
  status?: string;
  [key: string]: any;
}

async function updateUserStatus() {
  const isDryRun = !process.argv.includes('--execute');

  console.log('🔄 Starting status update process...');
  console.log(`🔧 Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'EXECUTE'}\n`);

  try {
    // Fetch all users
    console.log('📥 Fetching all users from Firestore...');
    const usersCollection = collection(db, 'Usuarios');
    const usersSnapshot = await getDocs(usersCollection);

    const users: Usuario[] = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as Usuario);
    });

    console.log(`✅ Found ${users.length} users\n`);

    // Filter users with status "active"
    const usersToUpdate = users.filter(user => user.status === 'active');

    console.log(`📊 Users with status "active": ${usersToUpdate.length}\n`);

    if (usersToUpdate.length === 0) {
      console.log('✨ No users need updating!');
      return;
    }

    if (isDryRun) {
      console.log('📋 DRY RUN - Would update the following users:');
      usersToUpdate.slice(0, 10).forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name || 'Usuario Sin Nombre'} (${user.email})`);
      });
      if (usersToUpdate.length > 10) {
        console.log(`   ... and ${usersToUpdate.length - 10} more users`);
      }
      console.log('\n💡 Run with --execute flag to apply changes');
      return;
    }

    // Update users
    console.log('🚀 Updating user status...\n');
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < usersToUpdate.length; i++) {
      const user = usersToUpdate[i];
      try {
        const userDocRef = doc(db, 'Usuarios', user.id);
        await updateDoc(userDocRef, {
          status: 'Activo',
          updatedAt: new Date().toISOString()
        });

        successCount++;
        console.log(`✅ [${successCount}] Updated: ${user.name || 'Usuario Sin Nombre'} (${user.email})`);

        // Progress indicator every 50 users
        if (successCount % 50 === 0) {
          console.log(`📊 Progress: ${successCount}/${usersToUpdate.length} users updated`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ [${i + 1}] Failed to update ${user.email}:`, error);
      }
    }

    console.log('\n📊 Update Results:');
    console.log(`✅ Successfully updated: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('\n✅ Process completed successfully!');

  } catch (error) {
    console.error('❌ Error during update process:', error);
    throw error;
  }
}

updateUserStatus();
