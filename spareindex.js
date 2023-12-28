// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    //grabs anything with a close of modal, initialises 
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);


    // anything collapsible is collapsed
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
  });






import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {getFirestore, collection, getDocs} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

//Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDg0TxmvYhXlsOE_ZcX4cqIYR4iudAfTn8",
    authDomain: "kpesacrowdfunding.firebaseapp.com",
    databaseURL: "https://kpesacrowdfunding-default-rtdb.firebaseio.com",
    projectId: "kpesacrowdfunding",
    storageBucket: "kpesacrowdfunding.appspot.com",
    messagingSenderId: "974087398858",
    appId: "1:974087398858:web:e5ada1937dfe81377c1b33"
};

// Initialising Firebase
const app = initializeApp(firebaseConfig);

// Initialize variables
const auth = firebase.auth();
const database = firebase.database();
const fs = getFirestore(app);


// Set up register function
function register() {
    console.log("Attempting to register user")
    // Get all  input fields
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    var fullName = document.getElementById('fullName').value

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Email or Password is incorrect')
        return
        // Don't continue running the code
    }
    if (validate_field(fullName) == false) {
        alert('Enter correct full name')
        return
    }

    const promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch((err) => errorNotification(err.message))

    /*
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then(function () {
            // Declare user variable
            var user = auth.currentUser

            // Add this user to Firebase Database
            var database_ref = database.ref()

            // Create User data
            var user_data = {
                email: email,
                full_name: fullName,
                last_login: Date.now()
            }

            // Push to Firebase Database
            database_ref.child('users/' + user.uid).set(user_data)

            // DOne
            alert('User Created!!')
        })
        .catch(function (error) {
            // Firebase will use this to alert of its errors
            var error_code = error.code
            var error_message = error.message

            alert(error_message)
        })*/
}