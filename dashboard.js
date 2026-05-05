import { db } from "./firebase.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================
// LOAD LOGGED-IN STUDENT
// =========================
window.loadMyProfile = async function () {

  const id = localStorage.getItem("studentDocId");

  if (!id) {
    window.location.href = "index.html";
    return;
  }

  try {

    const snap = await getDoc(doc(db, "students", id));

    if (!snap.exists()) {
      alert("Student not found ❌");
      return;
    }

    const d = snap.data();

    // =========================
    // PROFILE DATA
    // =========================
    document.getElementById("profileName").innerText =
      `${d.firstName} ${d.lastName}`;

    document.getElementById("profileEmail").innerText = d.email;
    document.getElementById("profilePhone").innerText = d.phone;
    document.getElementById("profileCourse").innerText = d.course;

    // PROFILE PHOTO
    document.getElementById("profilePhoto").src =
      d.photoUrl || "https://via.placeholder.com/120";

    // PREFILL EDIT FIELDS
    document.getElementById("editPhone").value = d.phone || "";
    document.getElementById("editCourse").value = d.course || "";

  } catch (error) {
    console.error(error);
    alert("Failed to load profile ❌");
  }
};

// =========================
// UPDATE PROFILE
// =========================
window.updateMyProfile = async function () {

  const id = localStorage.getItem("studentDocId");

  if (!id) return;

  try {

    const updateData = {
      phone: document.getElementById("editPhone").value,
      course: document.getElementById("editCourse").value
    };

    await updateDoc(doc(db, "students", id), updateData);

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
// AUTO LOAD
// =========================
window.addEventListener("load", loadMyProfile);