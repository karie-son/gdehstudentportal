import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   🔥 FIREBASE CONFIG (YOUR KEYS)
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyAfU4nLbLjrotVYaLXlB8M6ePM5lu6FfUU",
  authDomain: "gdeh-student-portal.firebaseapp.com",
  projectId: "gdeh-student-portal",
  storageBucket: "gdeh-student-portal.firebasestorage.app",
  messagingSenderId: "376874530975",
  appId: "1:376874530975:web:95e97098fc8708e5b94aaa"
};

/* INIT */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================
   SESSION MANAGEMENT
========================= */

export function setSession(user) {
  localStorage.setItem("student", JSON.stringify(user));
}

export function getSession() {
  return JSON.parse(localStorage.getItem("student"));
}

export function logout() {
  localStorage.removeItem("student");
}

/* =========================
   FIRESTORE FUNCTIONS
========================= */

/* REGISTER STUDENT */
export async function registerStudent(data) {
  return await addDoc(collection(db, "students"), {
    ...data,
    createdAt: new Date()
  });
}

/* LOGIN STUDENT */
export async function loginStudent(email, idNumber) {
  const q = query(collection(db, "students"), where("email", "==", email));
  const snap = await getDocs(q);

  let foundUser = null;

  snap.forEach(docSnap => {
    const data = docSnap.data();

    if (data.idNumber === idNumber) {
      foundUser = { id: docSnap.id, ...data };
    }
  });

  return foundUser;
}

/* GET SINGLE STUDENT */
export async function getStudentById(id) {
  const ref = doc(db, "students", id);
  const snap = await getDoc(ref);

  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/* UPDATE STUDENT */
export async function updateStudent(id, data) {
  const ref = doc(db, "students", id);
  return await updateDoc(ref, data);
}