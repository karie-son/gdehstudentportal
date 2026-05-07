import { kenyaData } from "./kenyaData.js";
import { auth, db, storage } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// =========================
// DOM READY
// =========================
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("studentForm");
  const countyEl = document.getElementById("county");
  const subCountyEl = document.getElementById("subCounty");
  const wardEl = document.getElementById("ward");
  const profilePhoto = document.getElementById("profilePhoto");
  const submitBtn = form.querySelector("button[type='submit']");

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

    submitBtn.disabled = true;

    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value.trim();

    try {

      // =========================
      // VALIDATION
      // =========================
      if (!email || !password) {
        showError("Email and password required ❌");
        submitBtn.disabled = false;
        return;
      }

      if (!countyEl.value || !subCountyEl.value || !wardEl.value) {
        showError("Select location ❌");
        submitBtn.disabled = false;
        return;
      }

      const file = profilePhoto.files[0];

      if (!file) {
        showError("Profile photo required ❌");
        submitBtn.disabled = false;
        return;
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
        showError("Only JPG, JPEG, PNG allowed ❌");
        submitBtn.disabled = false;
        return;
      }

      const validSize = await checkImageDimensions(file);

      if (!validSize) {
        showError("Image should be 600x600 ❌");
        submitBtn.disabled = false;
        return;
      }

      // =========================
      // CREATE USER
      // =========================
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // =========================
      // UPLOAD PHOTO
      // =========================
      const storageRef = ref(storage, `studentProfiles/${user.uid}`);

      await uploadBytes(storageRef, file);

      const photoURL = await getDownloadURL(storageRef);

      // =========================
      // SAVE FIRESTORE DATA
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

        profilePhoto: photoURL,

        createdAt: new Date().toISOString()
      });

      showSuccess("Registration successful ✅");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);

    } catch (err) {

      console.log(err.code, err.message);
      showError(err.message);

      submitBtn.disabled = false;
    }

  });

});

// =========================
// IMAGE VALIDATION
// =========================
function checkImageDimensions(file) {

  return new Promise((resolve) => {

    const img = new Image();

    img.onload = function () {
      resolve(this.width >= 600 && this.height >= 600);
    };

    img.src = URL.createObjectURL(file);

  });

}

// =========================
// UI MESSAGES
// =========================
function showError(msg) {
  alert(msg);
}

function showSuccess(msg) {
  alert(msg);
}
