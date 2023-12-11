import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getDatabase, set, get, update, remove, ref, child }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

import { getAuth, }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"


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
const auth = getAuth(app)
const database = firebase.database()

// Set up register function
function register() {
    // Get all  input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    fullName = document.getElementById('fullName').value

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
        })
}