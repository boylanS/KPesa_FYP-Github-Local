import {initializeApp} from "firebase/app";

import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where, orderBy, serverTimestamp,
    getDoc, updateDoc
} from "firebase/firestore"

import{
    getAuth, createUserWithEmailAndPassword
} from "firebase/auth"


const firebaseConfig = {
    apiKey: "AIzaSyDg0TxmvYhXlsOE_ZcX4cqIYR4iudAfTn8",
    authDomain: "kpesacrowdfunding.firebaseapp.com",
    databaseURL: "https://kpesacrowdfunding-default-rtdb.firebaseio.com",
    projectId: "kpesacrowdfunding",
    storageBucket: "kpesacrowdfunding.appspot.com",
    messagingSenderId: "974087398858",
    appId: "1:974087398858:web:e5ada1937dfe81377c1b33"
  };

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

//signing users up

const signupForm = document.querySelector(".signup")
signupForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
    .then((cred) =>{
        console.log("User created: ",cred.user);
        signupForm.reset();
    })
    .catch((err) => {
        console.log(err.message)
    })
});