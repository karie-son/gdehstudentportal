import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.login = async function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const snapshot = await getDocs(collection(db, "students"));

  for (let docSnap of snapshot.docs) {

    const data = docSnap.data();

    if (data.email === email && data.password === password) {

      // SAVE SESSION
      localStorage.setItem("studentDocId", docSnap.id);
      localStorage.setItem("studentEmail", email);

      window.location.href = "dashboard.html";
      return;
    }
  }

  alert("Invalid login");
};