import {initializeApp} from "firebase/app";

import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where, orderBy, serverTimestamp,
    getDoc, updateDoc, getDocs
} from "firebase/firestore"

import{
    getAuth, 
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
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

// listen for auth state changes

onAuthStateChanged(auth, (user) =>{
  if (user){
    console.log("user logged in: ",user);
  }
  else{
    console.log("user logged out.");
  }




});

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
    //console.log(cred.user);
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});

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
      //console.log(cred.user);

      //close login modal and reset form
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    })


  })



};

//logout
if (document.querySelector("#logout")){
  const logout = document.querySelector("#logout");
  logout.addEventListener("click", (e) =>{
    e.preventDefault();
    signOut(auth);
  })


};
  

// FIRESTORE JAVASCRIPT

//collection ref
const colRef = collection(db, "campaigns");

//queries

const q = query(colRef, orderBy("createdAt"));

// real time collection data

onSnapshot(q, (snapshot) => {
  let campaigns = []

  // here, for each object in the array we are
  //creating a new campaign object with the
  //data attributes split up and identified and 
  //the id pulled
  snapshot.docs.forEach((doc) => {
    campaigns.push({...doc.data(), id: doc.id})
  })
  console.log(campaigns)

})

//get collection data
getDocs(colRef).then((snapshot) => {
   
  })
  .catch(err => {
    console.log(err.message)
  });





//render campaign

const campaignList = document.querySelector("#campaign-list");

function renderCampaign(doc){
  
  let li = document.createElement("li");

  let name = document.createElement("h2");

  let description = document.createElement("p");

  let image = document.createElement("IMG");

  li.setAttribute("data-id", doc.id);

  name.textContent = doc.data().name;
  description.textContent = doc.data().description;
  image.src = doc.data().image;

  li.appendChild(name);
  li.appendChild(description);
  li.appendChild(image);

  campaignList.appendChild(li);
    
  
}

getDocs(colRef).then((snapshot) => {
  snapshot.docs.forEach(doc => {
    renderCampaign(doc);
  })

})

/*
//displaying data
getDocs(colRef).then((snapshot) => {
  snapshot.forEach(doc => {
    let data = doc.data();
    let row = <tr>
      <td>doc.id</td>
   
      <td>${data.category}</td>
      <td>${data.description}</td>
      <td>${data.target}</td>
      <td>${data.raised}</td>
    </tr>;
    let table = document.getElementById("myTable")
    table.innerHTML += row
  })
})
.catch(err => {
  console.log("Error: ${err}")
})*/



//Adding documents

const addCampaignForm = document.querySelector(".add");
addCampaignForm.addEventListener("submit",(e) =>{
  e.preventDefault()

  addDoc(colRef, {
    bankCountry: addCampaignForm.bankCountry.value,
    category: addCampaignForm.category.value,
    country: addCampaignForm.country.value,
    description: addCampaignForm.description.value,
    image: addCampaignForm.image.value,
    name: addCampaignForm.name.value,
    raised: addCampaignForm.raised.value,
    target: addCampaignForm.target.value,
    createdAt: serverTimestamp()

  })
  .then(() => {
    addCampaignForm.reset();
  })
})


//Deleting documents

const deleteCampaignForm = document.querySelector(".delete");
deleteCampaignForm.addEventListener("submit", (e) =>{
  e.preventDefault();

  const docRef = doc(db, "campaigns", deleteCampaignForm.id.value)

  deleteDoc(docRef)
  .then(() => {
    deleteCampaignForm.reset()
  })
})

// get a single document

const docRef = doc(db, "campaigns", "tcuu8dymVtGuDJqipsa3")

onSnapshot(docRef, (doc) =>{
  console.log(doc.data(), doc.id)
})

// updating a document

const updateForm = document.querySelector(".update")
updateForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const docRef = doc(db, "campaigns", updateForm.id.value)

  updateDoc(docRef, {
    name: "updated name"
  })
  .then(() => {
    updateForm.reset();
  })
})

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

