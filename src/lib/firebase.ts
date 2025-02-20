import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Only initialize Firebase when using the Firebase auth provider.
// In Keycloak mode we avoid initializing Firebase to prevent missing-env errors.
const provider = (process.env.NEXT_PUBLIC_AUTH_PROVIDER || 'firebase').toLowerCase();

let authInstance: any = null;

if (provider === 'firebase') {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Initialize only if an API key is present; otherwise let Firebase throw in Firebase mode.
  // In Keycloak mode we don't reach this branch.
  const app = initializeApp(firebaseConfig);
  authInstance = getAuth(app);
}

// Export as a singleton. In Keycloak mode this will be `null` and should not be used
// (Firebase-specific code paths are disabled in that mode).
export const auth = authInstance;