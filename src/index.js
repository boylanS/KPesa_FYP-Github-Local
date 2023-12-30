import {initializeApp} from "firebase/app";

import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where, orderBy, serverTimestamp,
    getDoc, updateDoc
} from "firebase/firestore"

import{
    getAuth, 
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword
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

//db.settings({ timestampsInSnapshots: true});

//AUTHENTICATION JAVASCRIPT


// signing users up


if (document.querySelector("#modal-signup")){
const signupForm = document.querySelector('#signup-form');

//signupForm.addEventListener("submit", alert("sign up"));


signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  createUserWithEmailAndPassword(auth, email, password).then(cred => {
    console.log(cred.user);
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});

}

// logging user out
if (document.querySelector("#logout")){

  const logout = document.querySelector("#logout");

  logout.addEventListener("click", (e) => {

    e.preventDefault();

    signOut(auth).then(() => {
      console.log("user signed out");
    });

  })

}

//logging user in
if (document.querySelector("#modal-login")){
  

  const loginForm = document.querySelector("#login-form");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //get user info

    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;

    signInWithEmailAndPassword(auth, email, password).then(cred => {
      console.log(cred.user);

      //close login modal and reset form
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    })


  })



};

/*
  const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user created:', cred.user)
      signupForm.reset()
      alert("that worked!")
    })
    .catch(err => {
      console.log(err.message)
    })
})

}


// logging in and out
if (document.querySelector('.logout')){
  const logoutButton = document.querySelector('.logout')
  logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('user signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
})
}



if (document.querySelector('.login')){
  const loginForm = document.querySelector('.login')
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
      .then(cred => {
        console.log('user logged in:', cred.user)
        loginForm.reset()
      })
      .catch(err => {
        console.log(err.message)
      })
  })

}
*/
//signup

// signup
/*
const signupForm = signupContent.querySelector("#signup-form")
const signupButton = signupForm.querySelector("#signupButton")
signupButton.addEventListener("click", (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    console.log(cred.user);
    // close the signup modal & reset form
   // const modal = document.querySelector('#modal-signup');
   // M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});*/

/*
const signupForm = document.querySelector('#modal-signup');
signupForm.addEventListener("submit", (e) => {

    alert("sign up")
    e.preventDefault()

    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
    .then((cred) =>{
        console.log("User created: ",cred.user);
        signupForm.reset();
        alert("Sign up successful!");
    })
    .catch((err) => {
        console.log(err.message)
        alert(err.message)
    })
});*/

// signup
//const signupForm = document.querySelector('#signup-form');

//signupForm.addEventListener("submit", alert("sign up"));

/*
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    console.log(cred.user);
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});*/

