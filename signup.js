import { db, storage } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

window.signup = async function () {

  const firstName = document.getElementById("fname").value.trim();
  const lastName = document.getElementById("lname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!firstName || !lastName || !email || !password || !phone) {
    alert("Fill all fields");
    return;
  }

  const snapshot = await getDocs(collection(db, "students"));
  for (let docSnap of snapshot.docs) {
    if (docSnap.data().email === email) {
      alert("Email exists");
      return;
    }
  }

  const file = document.getElementById("photo").files[0];

  const storageRef = ref(storage, "students/" + Date.now() + file.name);
  await uploadBytes(storageRef, file);
  const photoURL = await getDownloadURL(storageRef);

  await addDoc(collection(db, "students"), {
    firstName,
    lastName,
    email,
    password,
    phone,
    photoUrl: photoURL,
    createdAt: new Date()
  });

  alert("Signup success");
  window.location.href = "index.html";
};