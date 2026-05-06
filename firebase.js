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
   FIREBASE CONFIG
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

---

# =========================
# SESSION MANAGEMENT (SAFE)
# =========================

export function setSession(user) {
  localStorage.setItem("student", JSON.stringify(user));
}

export function getSession() {
  try {
    const data = localStorage.getItem("student");
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Session error:", err);
    return null;
  }
}

export function logout() {
  localStorage.removeItem("student");
}

---

# =========================
# REGISTER STUDENT (SIGNUP)
# =========================

export async function registerStudent(data) {
  try {
    const docRef = await addDoc(collection(db, "students"), {
      ...data,
      createdAt: new Date()
    });

    return { success: true, id: docRef.id };

  } catch (error) {
    console.error("Register error:", error);
    return { success: false, error };
  }
}

---

# =========================
# LOGIN STUDENT (INDEX PAGE)
# =========================

export async function loginStudent(email, password) {
  try {
    const q = query(
      collection(db, "students"),
      where("email", "==", email)
    );

    const snap = await getDocs(q);

    let user = null;

    snap.forEach(docSnap => {
      const data = docSnap.data();

      if (data.password === password) {
        user = { id: docSnap.id, ...data };
      }
    });

    return user;

  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

---

# =========================
# GET STUDENT (DASHBOARD)
# =========================

export async function getStudentById(id) {
  try {
    const ref = doc(db, "students", id);
    const snap = await getDoc(ref);

    return snap.exists()
      ? { id: snap.id, ...snap.data() }
      : null;

  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

---

# =========================
# UPDATE STUDENT
# =========================

export async function updateStudent(id, data) {
  try {
    const ref = doc(db, "students", id);
    await updateDoc(ref, data);

    return true;

  } catch (error) {
    console.error("Update error:", error);
    return false;
  }
}