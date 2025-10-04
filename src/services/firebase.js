import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace this with YOUR config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDi3wHBH21anPLdkTyt_teMs2ZhzJO2Mfo",
    authDomain: "ahki-c55e1.firebaseapp.com",
    projectId: "ahki-c55e1",
    storageBucket: "ahki-c55e1.firebasestorage.app",
    messagingSenderId: "45282746211",
    appId: "1:45282746211:web:514c2a251f0d5bb29d7d56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;