import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const form = document.getElementById("signinForm");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    window.location.href = "dashboard.html";

  } catch (err) {
    showError("Invalid email or password ❌");
  }
});

// RED ERROR BOX
function showError(msg) {
  const box = document.createElement("div");
  box.innerText = msg;

  box.style.position = "fixed";
  box.style.top = "20px";
  box.style.left = "50%";
  box.style.transform = "translateX(-50%)";
  box.style.background = "red";
  box.style.color = "white";
  box.style.padding = "10px 20px";
  box.style.borderRadius = "5px";
  box.style.zIndex = "9999";

  document.body.appendChild(box);

  setTimeout(() => box.remove(), 3000);
}