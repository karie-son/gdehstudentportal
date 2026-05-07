// =========================
// IMPORTS
// =========================
import { kenyaData } from "./kenyaData.js";
import { auth, db, storage } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =========================
// DOM READY
// =========================
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("studentForm");

  const countyEl = document.getElementById("county");
  const subCountyEl = document.getElementById("subCounty");
  const wardEl = document.getElementById("ward");

  const profilePhoto = document.getElementById("profilePhoto");

  if (!form || !countyEl || !subCountyEl || !wardEl) return;

  // =========================
  // LOAD COUNTIES
  // =========================
  countyEl.innerHTML = `<option value="">Select County</option>`;

  Object.keys(kenyaData).forEach(county => {
    const opt = document.createElement("option");
    opt.value = county;
    opt.textContent = county;
    countyEl.appendChild(opt);
  });

  // =========================
  // COUNTY CHANGE
  // =========================
  countyEl.addEventListener("change", () => {
    subCountyEl.innerHTML = `<option value="">Select Sub County</option>`;
    wardEl.innerHTML = `<option value="">Select Ward</option>`;

    const subList = kenyaData[countyEl.value] || {};

    Object.keys(subList).forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      subCountyEl.appendChild(opt);
    });
  });

  // =========================
  // SUB COUNTY CHANGE
  // =========================
  subCountyEl.addEventListener("change", () => {
    wardEl.innerHTML = `<option value="">Select Ward</option>`;

    const wards = kenyaData[countyEl.value]?.[subCountyEl.value] || [];

    wards.forEach(w => {
      const opt = document.createElement("option");
      opt.value = w;
      opt.textContent = w;
      wardEl.appendChild(opt);
    });
  });

  // =========================
  // FORM SUBMIT
  // =========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    // =========================
    // BASIC VALIDATION
    // =========================
    if (!email || !password) {
      showError("Email and password required ❌");
      return;
    }

    if (!countyEl.value || !subCountyEl.value || !wardEl.value) {
      showError("Please select County, Sub County and Ward ❌");
      return;
    }

    // =========================
    // PHOTO VALIDATION
    // =========================
    const file = profilePhoto.files[0];

    if (!file) {
      showError("Profile photo required ❌");
      return;
    }

    // Allowed types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {
      showError("Only JPG, JPEG and PNG allowed ❌");
      return;
    }

    // =========================
    // CHECK IMAGE SIZE 600x600
    // =========================
    const imageValid = await checkImageDimensions(file);

    if (!imageValid) {
      showError("Image must be exactly 600x600 pixels ❌");
      return;
    }

    try {

      // =========================
      // CREATE USER
      // =========================
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCred.user;

      // =========================
      // UPLOAD PHOTO
      // =========================
      const storageRef = ref(
        storage,
        `studentProfiles/${user.uid}`
      );

      await uploadBytes(storageRef, file);

      // GET PHOTO URL
      const photoURL = await getDownloadURL(storageRef);

      // =========================
      // SAVE STUDENT DATA
      // =========================
      await setDoc(doc(db, "students", user.uid), {

        firstName: form.firstName.value,
        lastName: form.lastName.value,

        gender: form.gender.value,
        maritalStatus: form.maritalStatus.value,

        dob: form.dob.value,
        phone: form.phone.value,

        email: email,
        idNumber: form.idNumber.value,

        county: countyEl.value,
        subCounty: subCountyEl.value,
        ward: wardEl.value,

        currentAddress: form.currentAddress.value,
        permanentAddress: form.permanentAddress.value,

        course: form.course.value,
        intake: form.intake.value,
        mode: form.mode.value,

        emergencyName: form.emergencyName.value,
        emergencyPhone: form.emergencyPhone.value,
        relationship: form.relationship.value,

        // PHOTO
        profilePhoto: photoURL,

        createdAt: new Date().toISOString()

      });

      showSuccess("Registration successful ✅");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);

    } catch (err) {
      showError(err.message);
    }

  });

});

// =========================
// CHECK IMAGE DIMENSIONS
// =========================
function checkImageDimensions(file) {

  return new Promise((resolve) => {

    const img = new Image();

    img.onload = function () {

      if (this.width === 600 && this.height === 600) {
        resolve(true);
      } else {
        resolve(false);
      }

    };

    img.src = URL.createObjectURL(file);

  });

}

// =========================
// UI MESSAGES
// =========================
function showError(msg) {
  showBox(msg, "red");
}

function showSuccess(msg) {
  showBox(msg, "green");
}

function showBox(msg, color) {

  const box = document.createElement("div");

  box.innerText = msg;

  box.style.position = "fixed";
  box.style.top = "20px";
  box.style.left = "50%";
  box.style.transform = "translateX(-50%)";
  box.style.background = color;
  box.style.color = "white";
  box.style.padding = "10px 20px";
  box.style.borderRadius = "5px";
  box.style.zIndex = "9999";

  document.body.appendChild(box);

  setTimeout(() => box.remove(), 3000);

}

// =========================
// PASSWORD TOGGLE FUNCTION
// =========================
function togglePassword(fieldId, btn){

  const input = document.getElementById(fieldId);

  if (input.type === "password") {

    input.type = "text";
    btn.textContent = "◯";

  } else {

    input.type = "password";
    btn.textContent = "●";

  }

}
