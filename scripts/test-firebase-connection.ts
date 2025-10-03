import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_DB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_DB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_DB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_DB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_DB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_DB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_DB_MEASUREMENT_ID
};

console.log('Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
  console.log('\n🔍 Testing Firebase connection...\n');

  // Test 1: Read existing courses
  try {
    console.log('Test 1: Reading existing courses...');
    const cursosSnapshot = await getDocs(collection(db, 'cursos'));
    console.log(`✅ Success! Found ${cursosSnapshot.size} courses`);

    if (cursosSnapshot.size > 0) {
      const firstDoc = cursosSnapshot.docs[0];
      console.log('\nFirst course structure:');
      console.log(JSON.stringify(firstDoc.data(), null, 2));
    }
  } catch (error: any) {
    console.error('❌ Read failed:', error.message);
    console.error('Error code:', error.code);
  }

  // Test 2: Try to write a simple document
  try {
    console.log('\n\nTest 2: Writing a test document...');
    const testData = {
      title: "Test Course",
      description: "Test",
      price: 100,
      duration: "1h",
      status: "Activo",
      enrollments: 0,
      rating: 5,
      type: "online"
    };

    await setDoc(doc(db, 'cursos', 'test-write-123'), testData);
    console.log('✅ Write successful!');
  } catch (error: any) {
    console.error('❌ Write failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
  }

  process.exit(0);
}

testConnection();
