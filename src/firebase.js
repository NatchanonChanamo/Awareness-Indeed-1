import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDF-bNQZMvfCBP6Wt9sz2UzP0eHEjgqXt0",
  authDomain: "awarenessindeed01.firebaseapp.com",
  projectId: "awarenessindeed01",
  storageBucket: "awarenessindeed01.firebasestorage.app",
  messagingSenderId: "804115447293",
  appId: "1:804115447293:web:0f15948672b388f6ab2d94",
  measurementId: "G-FE1H8ZG4CB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };