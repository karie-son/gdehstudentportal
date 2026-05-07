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
  if (!form) return;

  const countyEl = document.getElementById("county");
  const subCountyEl = document.getElementById("subCounty");
  const wardEl = document.getElementById("ward");
  const profilePhoto = document.getElementById("profilePhoto");
  const submitBtn = form.querySelector("button[type='submit']");

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

    try {

      const email = form.email.value.trim().toLowerCase();
      const password = form.password.value.trim();

      // =========================
      // VALIDATION
      // =========================
      if (!email || !password) {
        return fail("Email & password required ❌");
      }

      if (!countyEl.value || !subCountyEl.value || !wardEl.value) {
        return fail("Select location ❌");
      }

      const file = profilePhoto.files[0];

      if (!file) {
        return fail("Profile photo required ❌");
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
        return fail("Only JPG, JPEG, PNG allowed ❌");
      }

      // file size limit (5MB safety)
      if (file.size > 5 * 1024 * 1024) {
        return fail("Image too large (max 5MB) ❌");
      }

      const validSize = await checkImageDimensions(file);

      if (!validSize) {
        return fail("Image must be exactly 600x600 ❌");
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
      // SAVE FIRESTORE
      // =========================
      await setDoc(doc(db, "students", user.uid), {

        firstName: form.firstName.value,
        lastName: form.lastName.value,
        gender: form.gender.value,
        maritalStatus: form.maritalStatus.value,
        dob: form.dob.value,
        phone: form.phone.value,
        email,
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

      success("Registration successful ✅");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);

    } catch (err) {

      console.error(err);
      fail(err.message);

    } finally {
      submitBtn.disabled = false;
    }

  });

  // =========================
  // HELPERS
  // =========================
  function fail(msg) {
    alert(msg);
    submitBtn.disabled = false;
  }

  function success(msg) {
    alert(msg);
  }

});

// =========================
// IMAGE CHECK
// =========================
function checkImageDimensions(file) {

  return new Promise((resolve) => {

    const img = new Image();

    img.onload = function () {
      resolve(this.width === 600 && this.height === 600);
    };

    img.src = URL.createObjectURL(file);

  });

}
