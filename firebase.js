// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAfU4nLbLjrotVYaLXlB8M6ePM5lu6FfUU",
  authDomain: "gdeh-student-portal.firebaseapp.com",
  projectId: "gdeh-student-portal",
  storageBucket: "gdeh-student-portal.firebasestorage.app",
  messagingSenderId: "376874530975",
  appId: "1:376874530975:web:95e97098fc8708e5b94aaa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export ONLY services
export { auth, db, storage };