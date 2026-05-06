import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================
// FIREBASE CONFIG
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyAfU4nLbLjrotVYaLXlB8M6ePM5lu6FfUU",
  authDomain: "gdeh-student-portal.firebaseapp.com",
  projectId: "gdeh-student-portal",
  storageBucket: "gdeh-student-portal.firebasestorage.app",
  messagingSenderId: "376874530975",
  appId: "1:376874530975:web:95e97098fc8708e5b94aaa"
};

// INIT
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// =========================
// GET STUDENT DATA
// =========================
export async function getStudent(uid) {
  const ref = doc(db, "students", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// =========================
// UPDATE STUDENT DATA
// =========================
export async function updateStudent(uid, data) {
  const ref = doc(db, "students", uid);
  await updateDoc(ref, data);
}

// =========================
// LOGOUT
// =========================
export async function logout() {
  await signOut(auth);
  window.location.href = "signin.html";
}