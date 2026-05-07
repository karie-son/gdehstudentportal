// =========================
// IMPORTS
// =========================
import {
  auth,
  db,
  logout,
  getStudent,
  updateStudent
} from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// =========================
// STORAGE
// =========================
const storage = getStorage();

let currentUserId = null;

// =========================
// AUTH CHECK
// =========================
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUserId = user.uid;

  try {

    // FETCH DATA FROM FIRESTORE
    const data = await getStudent(user.uid);

    if (!data) return;

    fillForm(data);

  } catch (err) {
    console.error(err);
  }

});

// =========================
// FILL DASHBOARD FORM
// =========================
function fillForm(data) {

  // FILL ALL INPUTS
  Object.keys(data).forEach((key) => {

    const el = document.querySelector(`[name='${key}']`);

    if (el) {
      el.value = data[key] ?? "";
    }

  });

  // SHOW PROFILE PHOTO
  const profileImg = document.getElementById("profilePreview");

  if (profileImg && data.profilePhoto) {
    profileImg.src = data.profilePhoto;
  }

}

// =========================
// UPDATE PROFILE
// =========================
const updateBtn = document.getElementById("updateBtn");

updateBtn?.addEventListener("click", async (e) => {

  e.preventDefault();

  if (!currentUserId) return;

  try {

    const updated = {};

    // =========================
    // GET FORM VALUES
    // =========================
    document.querySelectorAll("input, select, textarea")
      .forEach((el) => {

        if (
          el.name &&
          el.type !== "file"
        ) {
          updated[el.name] = el.value;
        }

      });

    // =========================
    // PROFILE PHOTO UPDATE
    // =========================
    const fileInput = document.getElementById("profilePhoto");

    const file = fileInput?.files[0];

    if (file) {

      // ALLOWED TYPES
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png"
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, JPEG and PNG allowed ❌");
        return;
      }

      // CHECK SIZE 600x600
      const validSize = await checkImageDimensions(file);

      if (!validSize) {
        alert("Image must be exactly 600x600 pixels ❌");
        return;
      }

      // UPLOAD IMAGE
      const storageRef = ref(
        storage,
        `studentProfiles/${currentUserId}`
      );

      await uploadBytes(storageRef, file);

      const photoURL = await getDownloadURL(storageRef);

      updated.profilePhoto = photoURL;

      // UPDATE PREVIEW
      const profileImg = document.getElementById("profilePreview");

      if (profileImg) {
        profileImg.src = photoURL;
      }

    }

    // =========================
    // UPDATE FIRESTORE
    // =========================
    await updateStudent(currentUserId, updated);

    alert("Profile updated successfully ✅");

  } catch (err) {

    console.error(err);

    alert("Update failed ❌");

  }

});

// =========================
// LOGOUT
// =========================
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", async () => {

  try {

    await logout();

    window.location.href = "index.html";

  } catch (err) {

    console.error(err);

  }

});

// =========================
// CHECK IMAGE DIMENSIONS
// =========================
function checkImageDimensions(file) {

  return new Promise((resolve) => {

    const img = new Image();

    img.onload = function () {

      if (
        this.width === 600 &&
        this.height === 600
      ) {
        resolve(true);
      } else {
        resolve(false);
      }

    };

    img.src = URL.createObjectURL(file);

  });

}// UPDATE PROFILE
// =========================
const updateBtn = document.getElementById("updateBtn");

updateBtn?.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!currentUserId) return;

  const updated = {};

  document.querySelectorAll("input, select, textarea").forEach((el) => {
    if (el.name) {
      updated[el.name] = el.value;
    }
  });

  try {
    await updateStudent(currentUserId, updated);
    alert("Profile updated successfully ✅");
  } catch (err) {
    alert("Update failed ❌");
    console.error(err);
  }
});

// =========================
// LOGOUT
// =========================
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", async () => {
  await logout();
});
