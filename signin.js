import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.login = async function () {

  try {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please fill all fields ❌");
      return;
    }

    const snapshot = await getDocs(collection(db, "students"));

    let found = false;

    for (let docSnap of snapshot.docs) {

      const data = docSnap.data();

      if (data.email === email && data.password === password) {

        // SAVE SESSION
        localStorage.setItem("studentDocId", docSnap.id);
        localStorage.setItem("studentEmail", email);

        found = true;
        break;
      }
    }

    if (found) {
      alert("Login successful ✅");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid email or password ❌");
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong ❌");
  }
};
