import { auth, logout, getStudent, updateStudent } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let currentUserId = null;

// =========================
// AUTH CHECK
// =========================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "signin.html";
    return;
  }

  currentUserId = user.uid;

  const data = await getStudent(user.uid);

  if (!data) return;

  fillForm(data);
});

// =========================
// FILL DASHBOARD FORM
// =========================
function fillForm(data) {
  Object.keys(data).forEach((key) => {
    const el = document.querySelector(`[name='${key}']`);
    if (el) {
      el.value = data[key] ?? "";
    }
  });
}

// =========================
// UPDATE PROFILE
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