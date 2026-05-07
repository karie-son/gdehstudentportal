import {
  auth,
  logout,
  getStudent,
  updateStudent
} from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import { storage } from "./firebase.js";

// =========================
// AUTH CHECK
// =========================
let currentUserId = null;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUserId = user.uid;

  const data = await getStudent(user.uid);

  if (data) {
    fillForm(data);
  }

});

// =========================
// FILL FORM
// =========================
function fillForm(data) {

  Object.keys(data).forEach((key) => {

    const el = document.querySelector(`[name="${key}"]`);

    if (el && el.type !== "file") {
      el.value = data[key] ?? "";
    }

  });

  const img = document.getElementById("profilePreview");

  if (img && data.profilePhoto) {
    img.src = data.profilePhoto;
  }

}

// =========================
// UPDATE PROFILE
// =========================
const updateBtn = document.getElementById("updateBtn");

updateBtn?.addEventListener("click", async (e) => {

  e.preventDefault();

  if (!currentUserId) return;

  updateBtn.disabled = true;

  try {

    const updated = {};

    // GET ALL INPUT VALUES
    document.querySelectorAll("input, select, textarea").forEach((el) => {
      if (el.name && el.type !== "file") {
        updated[el.name] = el.value;
      }
    });

    // =========================
    // PROFILE PHOTO UPDATE
    // =========================
    const file = document.getElementById("profilePhoto")?.files[0];

    if (file) {

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, JPEG, PNG allowed ❌");
        updateBtn.disabled = false;
        return;
      }

      const valid = await checkImageDimensions(file);

      if (!valid) {
        alert("Image must be 600x600 ❌");
        updateBtn.disabled = false;
        return;
      }

      const storageRef = ref(storage, `studentProfiles/${currentUserId}`);

      await uploadBytes(storageRef, file);

      const photoURL = await getDownloadURL(storageRef);

      updated.profilePhoto = photoURL;

      document.getElementById("profilePreview").src = photoURL;
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

  updateBtn.disabled = false;

});

// =========================
// LOGOUT
// =========================
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await logout();
});

// =========================
// IMAGE VALIDATION
// =========================
function checkImageDimensions(file) {

  return new Promise((resolve) => {

    const img = new Image();

    img.onload = () => {
      resolve(img.width >= 600 && img.height >= 600);
    };

    img.src = URL.createObjectURL(file);

  });

}
