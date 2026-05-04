// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyAfU4nLbLjrotVYaLXlB8M6ePM5lu6FfUU",
  authDomain: "gdeh-student-portal.firebaseapp.com",
  projectId: "gdeh-student-portal",
  storageBucket: "gdeh-student-portal.firebasestorage.app",
  messagingSenderId: "376874530975",
  appId: "1:376874530975:web:95e97098fc8708e5b94aaa"
};

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// =========================
// AUTO ADMIN LOGIN
// =========================
const ADMIN_EMAIL = "gdehcbo2026@gmail.com";
const ADMIN_PASSWORD = "12345678A";


// =========================
// SIGNUP FUNCTION
// =========================
window.signup = async function () {

  try {
    const data = {
      firstName: document.getElementById("fname").value,
      lastName: document.getElementById("lname").value,
      dob: document.getElementById("dob").value,
      gender: document.getElementById("gender").value,

      country: document.getElementById("country").value,
      county: document.getElementById("county").value,
      subcounty: document.getElementById("subcounty").value,
      ward: document.getElementById("ward").value,

      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value, // ⚠️ not secure

      course: document.getElementById("course").value,
      intake: document.getElementById("intake").value,
      registrationDate: document.getElementById("regdate").value,
      mode: document.getElementById("mode").value,

      emergencyName: document.getElementById("emergencyName").value,
      relationship: document.getElementById("relationship").value,

      createdAt: new Date()
    };

    await addDoc(collection(db, "students"), data);

    alert("✅ Signup successful");
    window.location.href = "index.html";

  } catch (error) {
    console.error(error);
    alert("❌ Signup failed");
  }
};


// =========================
// LOAD STUDENTS (DASHBOARD)
// =========================
window.loadStudents = async function () {

  const table = document.getElementById("studentTable");
  if (!table) return;

  table.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "students"));

  let count = 1;

  querySnapshot.forEach((doc) => {
    const d = doc.data();

    table.innerHTML += `
      <tr>
        <td>${count++}</td>
        <td>${d.firstName || ""} ${d.lastName || ""}</td>
        <td>${d.phone || ""}</td>
        <td>${d.course || ""}</td>
        <td>${d.intake || ""}</td>
        <td>${d.mode || ""}</td>
      </tr>
    `;
  });
};
window.login = async function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // =========================
  // ADMIN AUTO LOGIN
  // =========================
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    alert("✅ Admin login successful");
    window.location.href = "admin.html";
    return;
  }

  // =========================
  // STUDENT LOGIN
  // =========================
  try {

    const querySnapshot = await getDocs(collection(db, "students"));

    let isValidStudent = false;

    for (const doc of querySnapshot.docs) {
      const data = doc.data();

      if (data.email === email && data.password === password) {
        isValidStudent = true;
        break;
      }
    }

    if (isValidStudent) {
      alert("✅ Student login successful");
      window.location.href = "dashboard.html";
    } else {

      const errorBox = document.getElementById("errorBox");

      if (errorBox) {
        errorBox.style.display = "block";
        errorBox.textContent = "❌ Invalid credentials";

        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }

        setTimeout(() => {
          errorBox.style.display = "none";
        }, 3000);
      } else {
        alert("❌ Invalid credentials");
      }
    }

  } catch (error) {
    console.error(error);

    const errorBox = document.getElementById("errorBox");

    if (errorBox) {
      errorBox.style.display = "block";
      errorBox.textContent = "❌ Login error";

      setTimeout(() => {
        errorBox.style.display = "none";
      }, 3000);
    }
  }
};