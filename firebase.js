import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAfU4nLbLjrotVYaLXlB8M6ePM5lu6FfUU",
  authDomain: "gdeh-student-portal.firebaseapp.com",
  projectId: "gdeh-student-portal",
  storageBucket: "gdeh-student-portal.firebasestorage.app",
  messagingSenderId: "376874530975",
  appId: "1:376874530975:web:95e97098fc8708e5b94aaa"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
