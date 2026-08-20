import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const getFirebaseConfig = () => {
  const env = (import.meta as any).env || {};
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.VITE_FIREBASE_APP_ID || '',
  };
};

export const isFirebaseConfigured = (): boolean => {
  const env = (import.meta as any).env || {};
  const apiKey = env.VITE_FIREBASE_API_KEY;
  const projectId = env.VITE_FIREBASE_PROJECT_ID;
  return Boolean(apiKey && apiKey.trim().length > 5 && projectId && projectId.trim().length > 2);
};

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

export const getFirebaseAuth = (): Auth | null => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  try {
    if (!firebaseApp) {
      const config = getFirebaseConfig();
      firebaseApp = getApps().length === 0 ? initializeApp(config) : getApp();
    }
    if (!firebaseAuth && firebaseApp) {
      firebaseAuth = getAuth(firebaseApp);
    }
    return firebaseAuth;
  } catch (err) {
    console.warn('[FIREBASE INIT WARN]', err);
    return null;
  }
};
