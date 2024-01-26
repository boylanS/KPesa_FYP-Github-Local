// IMPORTING FIREBASE FUNCTIONS

//Firebase App

import {initializeApp} from "firebase/app";

//Firestore Functions

import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, setDoc,
    query, where, orderBy, serverTimestamp,
    getDoc, updateDoc, getDocs
} from "firebase/firestore"

//Auth Functions

import{
    getAuth, 
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth"

//Firebase configuration for KPesa Database

const firebaseConfig = {
    apiKey: "AIzaSyDg0TxmvYhXlsOE_ZcX4cqIYR4iudAfTn8",
    authDomain: "kpesacrowdfunding.firebaseapp.com",
    databaseURL: "https://kpesacrowdfunding-default-rtdb.firebaseio.com",
    projectId: "kpesacrowdfunding",
    storageBucket: "kpesacrowdfunding.appspot.com",
    messagingSenderId: "974087398858",
    appId: "1:974087398858:web:e5ada1937dfe81377c1b33"
  };

//Initialises firebase app
initializeApp(firebaseConfig);

//Defines database and auth references
const db = getFirestore();
const auth = getAuth();

//initialising doc ID

 const currentCampaignRef = doc(db, "currentCampaign", "1");


//localStorage.setItem("currentCampaign","DzN8ySvSq344slRZqAff")

 var currentCampaignId = "DzN8ySvSq344slRZqAff";
//AUTHENTICATION JAVASCRIPT

// listen for auth state changes

onAuthStateChanged(auth, (user) =>{
  if (user){
    db.collection
    console.log("user logged in: ",user);
    setupUI(user);

    if (document.querySelector("#campaignDiv")){
      campaignDiv.innerHTML= "";
      //get collection data

      //onSnapshot ensures the collection will update
      //in real time
      onSnapshot(colRef, (snapshot) => {
        snapshot.docs.forEach(doc =>{
          renderCampaign(doc);
        })
      })
      
    }

  }else{
    console.log("user logged out.");

    setupUI();

    if (document.querySelector("#campaignDiv")){
      renderCampaign([]);
    }

  }

});

// signing users up
if (document.querySelector("#modal-signup")){
  const signupForm = document.querySelector('#signup-form');

  signupForm.addEventListener("submit", (e) => {
     e.preventDefault();
  
  // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

  // sign up the user
    createUserWithEmailAndPassword(auth, email, password).then(async cred => {
      
      return await setDoc(doc(db, "users",cred.user.uid),{
        bio: signupForm["signup-bio"].value
      })
   
    }).then(() => {
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


//render campaign

const campaignList = document.querySelector("#campaign-list");
const campaignDiv = document.querySelector(".float-container");

function renderCampaign(doc){

  if (doc.length != 0){

    //WORKS WITH THE LIST 

    let floatContainer = document.createElement("div");
    floatContainer.setAttribute("class","float-child");


    let card = document.createElement("div");
    card.setAttribute("class","card");
    let image = document.createElement("IMG");
    image.setAttribute("style","width:100%");
    let container = document.createElement("div");
    container.setAttribute("class","container");
    let name = document.createElement("h4");
    let description = document.createElement("p");
    let pageButton = document.createElement("button");

    let tempID = document.createElement("p");
    pageButton.textContent = "Read more";
    pageButton.setAttribute("href","/itempage.html");

    //li.setAttribute("data-id", doc.id);
    name.textContent = doc.data().name;
    description.textContent = doc.data().description;
    image.src = doc.data().image;
    let idCurrent = doc.id;
  

    //currentCampaign = doc.id;

    pageButton.addEventListener("click", () => {
      localStorage.setItem("currentCampaign", idCurrent);
      currentCampaignId = idCurrent;
      //alert(localStorage.getItem("currentCampaign"));
      renderCampaignPage();
    });

    container.appendChild(name);
    container.appendChild(description);
    container.appendChild(pageButton);

     card.appendChild(image);
     card.appendChild(container);

     floatContainer.appendChild(card);
     campaignDiv.appendChild(floatContainer);

  

  } else{
    campaignDiv.innerHTML=
    '<h5 class ="center-align">Login to view campaigns</h5>';
  }
  
  
}

//Rendering campaign page function

function renderCampaignPage(){
  window.location.href = "campaignPage.html";
  
}

if (document.querySelector("#singleCampaignPage")){
  fillPage();
}

function fillPage(){
  //alert("running")
  let currentCampaign = localStorage.getItem("currentCampaign");
    if (currentCampaign != null){
    alert("current campaign"+currentCampaign);
    const currentCampaignDoc = doc(db, "campaigns", currentCampaign);
    const campaignSnap = getDoc(currentCampaignDoc);

    onSnapshot(currentCampaignDoc, (doc) =>{
      console.log(doc.data(), doc.id)
      let titleDiv = document.querySelector("#campaignName");
      let title = document.createElement("h2");
      title.textContent = doc.data().name;
      titleDiv.appendChild(title);
      alert("this also runs");

    })

    

    let titleDiv = document.querySelector("#campaignName");

    let title = document.createElement("h2");
   // title.textContent = campaignSnap.data().name;
 


    //alert("this much has run");
   /* if (campaignSnap.exists()){
      console.log("Document data:", campaignSnap.data().name);
    } else{
      console.log("no such document");
    }*/
    //alert(currentCampaignDoc.data().name);
    //console.log(currentCampaignDoc.name);

  }
  //alert("it worked!");
  


 
}

//Adding documents
if (document.querySelector("#create-form")){ 
  const addCampaignForm = document.querySelector("#create-form");
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
  }).catch(err => {
    console.log(err.message);
  })
})

}



//Deleting documents

if (document.querySelector(".delete")){ 
  const deleteCampaignForm = document.querySelector(".delete");
  deleteCampaignForm.addEventListener("submit", (e) =>{
  e.preventDefault();

  const docRef = doc(db, "campaigns", deleteCampaignForm.id.value)

  deleteDoc(docRef)
  .then(() => {
    deleteCampaignForm.reset()
  })
})

}



// get a single document

const docRef = doc(db, "campaigns", "tcuu8dymVtGuDJqipsa3")

onSnapshot(docRef, (doc) =>{
  console.log(doc.data(), doc.id)
})

// updating a document

if (document.querySelector(".update")){ 
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

}



// HIDING NAV BAR LINKS

const loggedOutLinks = document.querySelectorAll(".logged-out");

const loggedInLinks = document.querySelectorAll(".logged-in");

const accountDetails = document.querySelector(".account-details");

const setupUI = (user) => {
  if (user) {
    //account information
    const userRef = doc(db, "users", user.uid)
    getDoc(userRef).then((doc) =>{
      const html = `
      <div> Logged in as ${user.email}</div>
      <div>${doc.data().bio}</div>
      `
    accountDetails.innerHTML = html;
    })


  
    //toggle UI elements
    loggedInLinks.forEach(item => item.style.display = "block");
    loggedOutLinks.forEach(item => item.style.display = "none");

  }
  else{
    //hide account info
    accountDetails.innerHTML = "";

    //toggle UI elements
    loggedInLinks.forEach(item => item.style.display = "none");
    loggedOutLinks.forEach(item => item.style.display = "block");

  }
}
