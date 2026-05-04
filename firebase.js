// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


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
const storage = getStorage(app);


// =========================
// SIGNUP FUNCTION
// =========================
window.signup = async function () {

  try {

    const file = document.getElementById("photo").files[0];

    if (!file) {
      alert("Please upload a profile photo");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG allowed ❌");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File must be less than 2MB ❌");
      return;
    }

    const storageRef = ref(storage, "students/" + Date.now() + "_" + file.name);

    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, "students"), {

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
      password: document.getElementById("password").value,

      course: document.getElementById("course").value,
      intake: document.getElementById("intake").value,
      registrationDate: document.getElementById("regdate").value,
      mode: document.getElementById("mode").value,

      emergencyName: document.getElementById("emergencyName").value,
      relationship: document.getElementById("relationship").value,

      photoUrl: photoURL,
      createdAt: new Date()
    });

    alert("Signup successful ✅");
    window.location.href = "index.html";

  } catch (error) {
    console.error(error);
    alert("Signup failed ❌");
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


// =========================
// STUDENT LOGIN ONLY
// =========================
window.login = async function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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
      alert("✅ Login successful");
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
