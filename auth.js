
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

 

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDg0TxmvYhXlsOE_ZcX4cqIYR4iudAfTn8",
    authDomain: "kpesacrowdfunding.firebaseapp.com",
    databaseURL: "https://kpesacrowdfunding-default-rtdb.firebaseio.com",
    projectId: "kpesacrowdfunding",
    storageBucket: "kpesacrowdfunding.appspot.com",
    messagingSenderId: "974087398858",
    appId: "1:974087398858:web:e5ada1937dfe81377c1b33"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

//Set auth language to English
auth.languageCode = "en"

const provider = new googleAuthProvider();

const googleLogin = document.getElementById("google-login-btn");

googleLogin.addEventListener("click", function(){
    alert(5)
})



// sign up
/*
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //get user info
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;

    //sign up the user

    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log(cred)


    })
})*/