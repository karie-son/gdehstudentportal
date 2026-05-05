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
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc
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
const storage = getStorage(app);


// =========================
// SIGNUP FUNCTION
// =========================
window.signup = async function () {
window.signup = async function () {

  try {

    // =========================
    // GET VALUES
    // =========================
    const firstName = document.getElementById("fname").value.trim();
    const lastName = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // =========================
    // BASIC VALIDATION
    // =========================
    if (!firstName || !lastName || !email || !password || !phone) {
      alert("Please fill all required fields ❌");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters ❌");
      return;
    }

    // =========================
    // CHECK DUPLICATE EMAIL
    // =========================
    const snapshot = await getDocs(collection(db, "students"));

    for (const docSnap of snapshot.docs) {
      const d = docSnap.data();

      if (d.email === email) {
        alert("Email already registered ❌");
        return;
      }
    }

    // =========================
    // IMAGE VALIDATION
    // =========================
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

    // =========================
    // UPLOAD IMAGE
    // =========================
    const storageRef = ref(storage, "students/" + Date.now() + "_" + file.name);

    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);

    // =========================
    // SAVE DATA
    // =========================
    await addDoc(collection(db, "students"), {

      firstName,
      lastName,
      dob: document.getElementById("dob").value,
      gender: document.getElementById("gender").value,

      country: document.getElementById("country").value,
      county: document.getElementById("county").value,
      subcounty: document.getElementById("subcounty").value,
      ward: document.getElementById("ward").value,

      phone,
      email,
      password,

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
// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
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
// LOAD ONLY LOGGED-IN STUDENT
// =========================
window.loadMyProfile = async function () {

  const id = localStorage.getItem("studentDocId");

  if (!id) {
    window.location.href = "index.html";
    return;
  }

  try {

    const ref = doc(db, "students", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("User not found ❌");
      return;
    }

    const d = snap.data();

    document.getElementById("profileName").innerText =
      d.firstName + " " + d.lastName;

    document.getElementById("profileEmail").innerText = d.email;
    document.getElementById("profilePhone").innerText = d.phone;
    document.getElementById("profileCourse").innerText = d.course;

  } catch (error) {
    console.error(error);
    alert("Error loading profile ❌");
  }
};


// =========================
// UPDATE PROFILE
// =========================
window.updateMyProfile = async function () {

  const id = localStorage.getItem("studentDocId");

  if (!id) return;

  try {

    await updateDoc(doc(db, "students", id), {
      phone: document.getElementById("editPhone").value,
      course: document.getElementById("editCourse").value
    });

    alert("Profile updated ✅");

    loadMyProfile();

  } catch (error) {
    console.error(error);
    alert("Update failed ❌");
  }
};


// =========================
// LOGOUT
// =========================
window.logout = function () {
  localStorage.clear();
  window.location.href = "index.html";
};


// =========================
// AUTO LOAD ON PAGE OPEN
// =========================
window.addEventListener("load", () => {
  loadMyProfile();
});
// =========================
// STUDENT LOGIN ONLY
// =========================
window.login = async function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    const querySnapshot = await getDocs(collection(db, "students"));

    let found = false;

    for (const docSnap of querySnapshot.docs) {

      const data = docSnap.data();

      if (data.email === email && data.password === password) {

        // SAVE identity
        localStorage.setItem("studentEmail", email);
        localStorage.setItem("studentDocId", docSnap.id);

        found = true;
        break;
      }
    }

    if (found) {
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
    alert("Login error ❌");
  }
};
