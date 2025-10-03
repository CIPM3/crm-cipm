import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_DB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_DB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_DB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_DB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_DB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_DB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_DB_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testUpload() {
  const testCourse = {
    title: "Test Course",
    description: "Test description",
    price: 100,
    duration: "01:00:00",
    status: "Activo",
    enrollments: 0,
    rating: 5,
    modules: ["test-module-1"],
    type: "online"
  };

  console.log('Testing upload with data:', JSON.stringify(testCourse, null, 2));

  try {
    await setDoc(doc(db, 'cursos', 'test-course-id'), testCourse);
    console.log('✅ Upload successful!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', JSON.stringify(error, null, 2));
  }

  process.exit(0);
}

testUpload();
