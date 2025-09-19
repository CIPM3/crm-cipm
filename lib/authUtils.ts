import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DB_COLLECCTIONS } from '@/lib/constants';
import { UsersType } from '@/types';
import { User } from 'firebase/auth';

/**
 * Updates user avatar from Firebase Auth if it's different from stored avatar
 */
export const syncUserAvatarFromAuth = async (
  firebaseUser: User, 
  userData: UsersType
): Promise<UsersType> => {
  // Check if Firebase Auth has a photo URL and it's different from stored avatar
  if (firebaseUser.photoURL && firebaseUser.photoURL !== userData.avatar) {
    const updatedUserData = { ...userData, avatar: firebaseUser.photoURL };
    
    try {
      // Update in Firestore database
      const userDocRef = doc(db, DB_COLLECCTIONS.USUARIOS, firebaseUser.uid);
      await setDoc(userDocRef, updatedUserData);
      
      console.log('✅ Avatar synced from Firebase Auth:', firebaseUser.photoURL);
      return updatedUserData;
    } catch (error) {
      console.error('❌ Error updating avatar in database:', error);
      // Return updated data even if database update fails
      return updatedUserData;
    }
  }
  
  return userData;
};

/**
 * Creates user data from Firebase Auth user for new users
 */
export const createUserDataFromFirebaseAuth = (firebaseUser: User): UsersType => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || '',
    email: firebaseUser.email || '',
    role: 'cliente',
    avatar: firebaseUser.photoURL || '',
    createdAt: new Date().toISOString(),
  };
};