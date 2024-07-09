import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js';

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
const db = getFirestore(app); 

function registerUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User registered:', user);
            sendEmailVerification(user)
                .then(() => {
                    alert('Verification email sent! Please check your inbox.');
                    monitorEmailVerification(user);
                    setTimeout(() => {
                        checkEmailVerificationStatus(user);
                    }, 60000); 
                })
                .catch((error) => {
                    console.error('Error sending verification email:', error.message);
                    alert('Error sending verification email: ' + error.message);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Registration error:', errorMessage);
            if (errorCode === 'auth/email-already-in-use') {
                alert("This email is already registered. Please use a different email.");
                location.reload();
            } else {
                alert(errorMessage);
            }
        });
}

function monitorEmailVerification(user) {
    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            currentUser.reload().then(() => {
                if (currentUser.emailVerified) {
                    alert('Email verified! Redirecting to login page.');
                    storeUserData(currentUser);
                    window.location.href = 'login.html';
                }
            });
        }
    });
}

function storeUserData(user) {
    const userData = {
        email: user.email,
        displayName: user.displayName,
    };

    addDoc(collection(db, 'users'), userData)
        .then((docRef) => {
            console.log('User data stored with ID: ', docRef.id);
        })
        .catch((error) => {
            console.error('Error storing user data: ', error);
            alert('Error storing user data: ' + error.message);
        });
}

function checkEmailVerificationStatus(user) {
    user.reload().then(() => {
        if (user.emailVerified) {
            alert('Email verified! Redirecting to login page.');
            storeUserData(user); 
            window.location.href = 'login.html';
        } else {
            alert('Please verify your email. Redirecting to verification page.');
            window.location.href = 'verify-email.html';
        }
    }).catch((error) => {
        console.error('Error checking email verification status:', error.message);
        alert('Error checking email verification status: ' + error.message);
    });
}

function validateform() {
    var email = document.getElementsByName('user_name')[0].value;
    var password = document.getElementsByName('password')[0].value;
    var confirmPassword = document.getElementsByName('confirm_password')[0].value;

    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email == null || email == "") {
        alert("Email can't be blank.");
        return false;
    } else if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    } else if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return false;
    } else if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    } else {
        registerUser(email, password);
        return true;
    }
}

document.getElementById('regBtn').addEventListener('click', (event) => {
    event.preventDefault(); 
    validateform();
});
