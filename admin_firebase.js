// Firebase imports  
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =========================  
// Firebase Config  
// =========================  
const firebaseConfig = {
  apiKey: "AIzaSyAfU4nLbLjrotVYaLXlB8M6ePM5lu6FfUU",
  authDomain: "gdeh-student-portal.firebaseapp.com",
  projectId: "gdeh-student-portal",
  storageBucket: "gdeh-student-portal.firebasestorage.app",
  messagingSenderId: "376874530975",
  appId: "1:376874530975:web:95e97098fc8708e5b94aaa"
};

// Init Firebase  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// =========================  
// ADMIN LOGIN  
// =========================  
const ADMIN_EMAIL = "gdehcbo2026@gmail.com";
const ADMIN_PASSWORD = "12345678A";

window.adminLogin = function () {

  const email = document.getElementById("adminEmail")?.value;
  const password = document.getElementById("adminPassword")?.value;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    alert("✅ Admin login successful");
    window.location.href = "admin.html";
  } else {
    alert("❌ Invalid admin credentials");
  }
};


// =========================  
// LOAD STUDENTS  
// =========================  
window.loadAdminStudents = async function () {

  const table = document.getElementById("adminStudentTable");
  if (!table) return;

  table.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "students"));

  let count = 1;

  querySnapshot.forEach((docSnap) => {

    const d = docSnap.data();

    table.innerHTML += `
      <tr>
        <td>${count++}</td>

        <td>
          <img src="${d.photoUrl || 'https://via.placeholder.com/40'}" class="avatar">
        </td>

        <td>${d.firstName || ""} ${d.lastName || ""}</td>
        <td>${d.phone || ""}</td>
        <td>${d.email || ""}</td>
        <td>${d.course || ""}</td>
        <td>${d.intake || ""}</td>
      </tr>
    `;
  });
};


// =========================  
// AUTO LOAD WHEN PAGE OPENS  
// =========================  
window.addEventListener("load", () => {
  loadAdminStudents();
});