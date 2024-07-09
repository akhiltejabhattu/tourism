import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyBV0eV_RjquBlq3mRtd9-51u0tJ1bHFoa4",
    authDomain: "bonvoyage-f2e1e.firebaseapp.com",
    projectId: "bonvoyage-f2e1e",
    storageBucket: "bonvoyage-f2e1e.appspot.com",
    messagingSenderId: "996957430498",
    appId: "1:996957430498:web:48346a5403bbc1b08974bb",
    measurementId: "G-ZR5PDHDVPV"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function register() {
    window.location.href = "register.html";
}

function login() {
    window.location.href = "main.html";
}

async function loginUser(username, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, username, password);
        const user = userCredential.user;
        console.log("User logged in:", user);
        login(); 
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    }
}

function validateform() {
    var user_name = document.getElementsByName("user_name")[0].value;
    var password = document.getElementsByName("password")[0].value;

    if (!user_name) {
        alert("Please enter your username.");
        return false;
    } else if (!password) {
        alert("Please enter your password.");
        return false;
    } else if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return false;
    }

    loginUser(user_name, password);
    return false; 
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginBtn').addEventListener('click', validateform);
});
