import {
  auth,
  logout,
  getStudent,
  updateStudent,
  storage
} from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// =========================
// AUTH CHECK (ONLY LOGGED USER)
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
// DISPLAY DATA ONLY
// =========================
function fillForm(data) {

  // TEXT DATA ONLY
  Object.keys(data).forEach((key) => {

    const el = document.querySelector(`[name="${key}"]`);

    if (el && el.type !== "file") {
      el.value = data[key] ?? "";
    }

  });

  // PROFILE PHOTO (FROM FIRESTORE ONLY)
  const img = document.getElementById("profilePreview");

  if (img) {
    img.src = data.profilePhoto || "profile.jpg";
  }

}

// =========================
// UPDATE PROFILE (TEXT ONLY)
// =========================
const updateBtn = document.getElementById("updateBtn");

updateBtn?.addEventListener("click", async (e) => {

  e.preventDefault();

  if (!currentUserId) return;

  updateBtn.disabled = true;

  try {

    const updated = {};

    // ONLY TEXT DATA
    document.querySelectorAll("input, select, textarea").forEach((el) => {
      if (el.name && el.type !== "file") {
        updated[el.name] = el.value;
      }
    });

    await updateStudent(currentUserId, updated);

    alert("Profile updated successfully ✅");

  } catch (err) {

    console.error(err);
    alert("Update failed ❌");

  }

  updateBtn.disabled = false;

});

// =========================
// OPTIONAL: PHOTO UPDATE (NOT REQUIRED)
// =========================
document.getElementById("profilePhoto")?.addEventListener("change", async (e) => {

  const file = e.target.files[0];
  if (!file || !currentUserId) return;

  const allowed = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowed.includes(file.type)) {
    alert("Only JPG, PNG allowed ❌");
    return;
  }

  const valid = await checkImage(file);

  if (!valid) {
    alert("Image must be 600x600 ❌");
    return;
  }

  const storageRef = ref(storage, `studentProfiles/${currentUserId}`);

  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  await updateStudent(currentUserId, { profilePhoto: url });

  document.getElementById("profilePreview").src = url;

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
function checkImage(file) {

  return new Promise((resolve) => {

    const img = new Image();

    img.onload = () => {
      resolve(img.width === 600 && img.height === 600);
    };

    img.src = URL.createObjectURL(file);

  });

}
