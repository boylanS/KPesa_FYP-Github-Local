// IMPORTING FIREBASE FUNCTIONS

//Firebase App

import {initializeApp} from "firebase/app";

//Firestore Functions

import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, setDoc,
    query, where, orderBy, serverTimestamp,
    getDoc, updateDoc, getDocs, limit
} from "firebase/firestore"

//Auth Functions

import{
    getAuth, 
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth"

//Storage Functions

import{
  getStorage, ref,
  uploadBytes, getDownloadURL

} from "firebase/storage"


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

//Defines database, auth and storage references
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();
//collection ref
const colRef = collection(db, "campaigns");

//initialising doc ID
 const currentCampaignRef = doc(db, "currentCampaign", "1");

//initialising explore campaigns page div
const campaignDiv = document.querySelector("#exploreCampaigns");

//AUTHENTICATION JAVASCRIPT


// listen for auth state changes
// This will dictate if a user receives the "logged in" UI or "not logged in" UI
onAuthStateChanged(auth, (user) =>{
  if (user){
    db.collection
    console.log("user logged in: ",user);
    setupUI(user);


  }else{
    console.log("user logged out.");
    setupUI();
}


// FILLING EXPLORE CAMPAIGNS PAGE 

//This will update explore campaigns page when a new doc is added or a doc is removed
  if (document.querySelector("#exploreCampaigns")){
    campaignDiv.innerHTML= ""; //clears div to initialise reuploading all campaigns
   
    //get collection data
    //onSnapshot ensures the collection will update
    //in real time
    onSnapshot(colRef, (snapshot) => {
      snapshot.docs.forEach(doc =>{
        renderCampaignCard(doc,"exploreCampaigns");
      })
    })
    
  }

});

//  ################   SIGNING USERS UP ################################################

//First, it is established if the user is on the page with the registration form
if (document.querySelector("#regForm")){

  // Define constants
  const regForm = document.querySelector("#regForm");
  const popup = document.querySelector(".popup"); 
  const prevBtnPage = document.querySelector("#prevBtn");
  const nextBtnPage = document.querySelector("#nextBtn");

  var currentTab = 0; // Current tab is set to be the first tab (0)
  showTab(currentTab); // Display the current tab

  //When previous button is clicked, moves a step back in the form
  prevBtnPage.addEventListener("click", () => {
    nextPrev(-1);
  })

  //When next button is clicked, moves a step forward in the form
  nextBtnPage.addEventListener("click", () => {
    nextPrev(1);
  })

}

//Opens a popup in the event of a signup error
function openSignupErrorPopup(){
  const popup = document.querySelector(".popupSignupError");
  popup.classList.add("open-popupSignupError");
  const continueBtn = popup.querySelector("#continueSignup")

  //Adds an event listener to the continue button so that it will
  //close the popup and reset the form when clicked
  continueBtn.addEventListener("click", () => {
    closeSignupErrorPopup();
    const regForm = document.querySelector("#regForm");
    regForm.reset();
    window.location.href = "signup.html"; //redirects user to beginning of form
  })
}

//Closes the popup when called
function closeSignupErrorPopup(){
  const popup = document.querySelector(".popupSignupError");
  popup.classList.remove("open-popupSignupError");
}

//Opens a popup in the event that a user is successful in signing up for the platform
function openPopup(){
  const popup = document.querySelector(".popup");
  popup.classList.add("open-popup");
  const continueBtn = popup.querySelector("#continueNewUser")

    //Adds an event listener to the continue button so that it will
  //close the popup and redirect the user when clicked
  continueBtn.addEventListener("click", () => {
    closePopup();
    window.location.href = "index.html";
  })
}

//Closes the successful user sign up popup
function closePopup(){
  const popup = document.querySelector("#popup");
  popup.classList.remove("open-popup");
}

// This function will display the specified tab of the user sign up form ...
function showTab(n) {
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n)
}

//Will check if an email has been provided in the correct form - returns a boolean value
function validateEmail(email){
  const emailRegex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);

}

 // This function will figure out which tab to display in the user sign up form
function nextPrev(n) {
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    const regForm = document.getElementById("regForm");
    
    // get user info is pulled from the form to be validated
   const email = regForm.email.value;
   const password = regForm.password.value;

   //If at least one of the email or password is formatted incorrectly, the user
   //will be presented with a popup error message. They will be required to resubmit
   //to create their account

   //Both email and password are incorrect
   if (!validateEmail(email) && password.length <= 6){
      const errorMessage = "Invalid email format. Must be in form xx@xx.xxx. Password must be greater than 6 characters.";
      const errParagraph = document.querySelector("#signupError");
      errParagraph.innerText = "Error message: "+errorMessage;
      openSignupErrorPopup();
   }

   //Password only is incorrect
   else if (password.length <= 6){
    const errorMessage = "Invalid password format. Password must be greater than 6 characters.";
    const errParagraph = document.querySelector("#signupError");
    errParagraph.innerText = "Error message: "+errorMessage;
    openSignupErrorPopup();
   }

   //Email only is incorrect
   else if (!validateEmail(email)){
    const errorMessage = "Invalid email format. Must be in form xx@xx.xxx";
      const errParagraph = document.querySelector("#signupError");
      errParagraph.innerText = "Error message: "+errorMessage;
      openSignupErrorPopup();
   }

   //If both are correct, sign up can proceed and an account can be created for the user
   else{

 // sign up the user with Firebase auth
   createUserWithEmailAndPassword(auth, email, password).then(async cred => {
     
    //Create a user record in the firestore database
     return await setDoc(doc(db, "users",cred.user.uid),{
      firstName: regForm.firstName.value,
      lastName: regForm.lastName.value,
      username: regForm.username.value,
      country: regForm.countryUser.value,
      email: regForm.email.value,
      bio: regForm.bio.value,
     })
  
   }).then(() => {
      //Open successful signup popup
      openPopup();
      
      //Backdrop is darkened
      const modalBackground = document.querySelector(".modalBackdrop");
      modalBackground.style.display = "block";

      //Continue button set to clear registration form and redirect user on click
      const continueBtn = popup.querySelector("#continueNewUser")
      continueBtn.addEventListener("click", () => {
        closePopup();
        window.location.href = "index.html";
        regForm.reset();
        document.getElementById("regForm").submit();
        modalBackground.style.display = "none";
        window.location.href = "index.html";
  })
     
  // In the event of an error with the Firebase auth sign up, the user is presented with an error message that
  //explains the error (e.g. account with email already exists)
   }).catch(error => {
      const errorMessage = error.message;
      const errParagraph = document.querySelector("#signupError");
      errParagraph.innerText = "Error message: "+errorMessage;
      openSignupErrorPopup();
      
   });

  }
   // return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

// This function deals with validation of the sign up form fields
function validateForm() {
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

// This function removes the "active" class of all steps...
function fixStepIndicator(n) {
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}

//  ################   LOGGING USER IN ################################################

//On every page there is a login modal, this code will run
if (document.querySelector("#modal-login")){
  
  const loginForm = document.querySelector("#login-form");

  //On submission of login form
  loginForm.addEventListener("submit", (e) => {
    
    //Prevents default submission
    e.preventDefault();

    //get user info necessary to sign in
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;

    //sign in with Firebase auth
    signInWithEmailAndPassword(auth, email, password).then(cred => {

      //close login modal and reset form
      const modal = document.querySelector('#modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      loginForm.querySelector(".error").innerHTML = "";


      //If logged in on the sign up page, the user will be redirected to the landing page
      if (document.querySelector("#regForm")){
        window.location.href="index.html";
      }
    }).catch(err => {
      //If login is unsuccessful, the user is presented with an error message within the modal
      loginForm.querySelector(".error").innerHTML = "Error - email and/or password is incorrect.";
    })
  })
};

//  ################   LOGGING USER IN ################################################

//On every page there is a logout tab, this code will run
if (document.querySelector("#logout")){
  const logout = document.querySelector("#logout");
  //On clicking the logout tab
  logout.addEventListener("click", (e) =>{
    e.preventDefault();
    //user is redirected to landing page
    window.location.href = "index.html";
    //user is signed out using Firebase auth
    signOut(auth);
  })
};
  
//  ################ RENDER CAMPAIGN EXPLORE PAGE ################################################

// Renders campaign cards for the explore page

function renderCampaignCard(doc, divId) {
  let pageDiv = document.getElementById(divId);

  if (doc.length != 0){

    // Creates a card for each campaign to be displayed on the landing page

    let floatContainer = document.createElement("div");
    floatContainer.setAttribute("class","float-child");

    let card = document.createElement("div");
    card.setAttribute("class","card");

    let image = document.createElement("IMG");
    image.setAttribute("style","width:100%");
    image.src = doc.data().image;

    let container = document.createElement("div");
    container.setAttribute("class","container");

    let name = document.createElement("h4");
    name.textContent = doc.data().name;

    let description = document.createElement("p");
    description.textContent = doc.data().description;

    let pageButton = document.createElement("button");
    pageButton.textContent = "Read more";
 
    let idCurrent = doc.id;

    //Clicking on the read more button will take you to that campaign's
    //individual page

    pageButton.addEventListener("click", () => {
      localStorage.setItem("currentCampaign", idCurrent);
      localStorage.setItem("currentCampaignName",doc.data().name)
      renderCampaignPage();
    });

    container.appendChild(name);
    container.appendChild(description);
    container.appendChild(pageButton);
    card.appendChild(image);
    card.appendChild(container);
    floatContainer.appendChild(card);

    //Appends new elements to the page
    pageDiv.appendChild(floatContainer);     

  } else{
    pageDiv.innerHTML=
    '<h5 class ="center-align">There are no active campaigns at present</h5>';
  }
}

//  ################ RENDER INDIVIDUAL CAMPAIGN PAGE ################################################

//redirects user to individual campaign page
function renderCampaignPage(){
  window.location.href = "campaignPage.html";
}

//Will fill page if it is identified as the single campaign page
if (document.querySelector("#singleCampaignPage")){
  fillPage();
}

function fillPage(){
  
  //retrives the current campaign (i.e. the campaign the user has interacted with)
  let currentCampaign = localStorage.getItem("currentCampaign");
   
  if (currentCampaign != null){

   // Current campaign document reference
    const currentCampaignDoc = doc(db, "campaigns", currentCampaign);

   // Calls the current campaign doc from the database
    onSnapshot(currentCampaignDoc, (doc) =>{
      
      //Creates elements to populate page and fills them
      //with content from the campaign document

      //title
      let titleDiv = document.querySelector("#campaignName");
      let title = document.createElement("h2");
      title.textContent = doc.data().name;
      titleDiv.appendChild(title);

      //bio
      let bioDiv = document.querySelector("#campaignBio");
      let bio = document.createElement("p");
      bio.textContent = doc.data().description;
      bioDiv.appendChild(bio);

      //category
      let categoryDiv = document.querySelector("#campaignCategory");
      let category = document.createElement("h6");
      category.textContent = doc.data().category;
      categoryDiv.appendChild(category);

      //money raised, target, and progress
      let raisedDiv = document.querySelector("#raisedDiv");
      let targetDiv = document.querySelector("#targetDiv");
      let targetDoc = document.createElement("h5");
      let raisedDoc = document.createElement("h5");
      let progressBar = document.createElement("div");
      progressBar.setAttribute("class","progressBarInner");

      targetDoc.textContent = "Target: "+doc.data().target;
      raisedDoc.textContent = "Raised: "+doc.data().raised;
      let outerProgressBar = document.querySelector("#progressBarOuter");

      //If no money has been raised
      if (Math.round((doc.data().raised/doc.data().target)*100,2) <= 0){
        outerProgressBar.textContent = "0% raised";
      }
      //If target has been met or exceeded
      else if (Math.round((doc.data().raised/doc.data().target)*100,2) >= 100){
        progressBar.textContent = "100% raised";
        progressBar.setAttribute("style","height: 24px; width: 100%");

      }
      //All other cases
      else{
        let percentageComplete = (Math.round((doc.data().raised/doc.data().target)*100,2))+"%";
        progressBar.setAttribute("style","height: 24px; width:"+percentageComplete);
        progressBar.textContent = percentageComplete+" raised";
      }
      
      raisedDiv.appendChild(raisedDoc);
      outerProgressBar.appendChild(progressBar);
      targetDiv.appendChild(targetDoc);
      
      //image
      let imageDiv = document.querySelector("#campaignImage");
      let imageSrc = doc.data().image;
      imageDiv.setAttribute("src",imageSrc);
      
      //rewards

      //collection reference for the campaign's rewards
      let collectionRef = collection(db, "campaigns",currentCampaign,"rewards");

      //fetches rewards from rewards subcollection under the campaign document
      onSnapshot(collectionRef, (querySnapshot) => {
        if (querySnapshot.empty){
          let noRewardsMsg = document.querySelector("#rewardsMsg");
          noRewardsMsg.textContent = "This campaign has no rewards available."
        }else{

          querySnapshot.forEach((doc) => {
            
            //Clears no rewards message if necessary 
            let noRewardsMsg = document.querySelector("#rewardsMsg");
            noRewardsMsg.textContent = ""

            //Each reward document in the subcollection is fetched and
            //presented on the interface

            let rewardDiv = document.querySelector("#rewards");
            let rewardList = rewardDiv.querySelector("#rewardList");
            let listElement = document.createElement("li");

            let rewardContainer = document.createElement("div");
            rewardContainer.setAttribute("class","rewardContainer");

            let rewardDivDonation = document.createElement("div");
            rewardDivDonation.setAttribute("class","rewardDonationDiv");

            let rewardDivDescription = document.createElement("div");
            rewardDivDescription.setAttribute("class","rewardDescriptionDiv");
            
            let rewardName = document.createElement("h5");
            rewardName.textContent = doc.data().name;

            let donation = document.createElement("button");
            donation.disabled = true;
            donation.setAttribute("class","donationAmount");
            const donationRounded = (Math.round(doc.data().donation * 100) / 100).toFixed(2);
            donation.textContent = donationRounded + " ";

            let rewardButtonDivCenter = document.createElement("div");
            rewardButtonDivCenter.setAttribute("class","center");
            
            let descriptionReward = document.createElement("p");
            descriptionReward.textContent = doc.data().description;

            rewardDivDescription.appendChild(rewardName);
            rewardButtonDivCenter.appendChild(donation);
            rewardDivDonation.appendChild(rewardButtonDivCenter);
            rewardDivDescription.appendChild(descriptionReward);
            rewardContainer.appendChild(rewardDivDonation);
            rewardContainer.appendChild(rewardDivDescription);
            rewardContainer.setAttribute("class","rewardContainer");

            //Finally, the reward is added to the document
            listElement.appendChild(rewardContainer);
            rewardList.appendChild(listElement);
          });
         }
      });
    })
  } else{
    window.location.href = "campaignExplore.html";
    alert("Error - no campaign selected");
  }
}

//  ################ PROCESSING DONATIONS ################################################

//Pages that have a donate button will have access to this functionality

if (document.querySelector("#donationButton")){
  const donate = document.querySelector("#donationButton");

  //When the donate button is clicked
  donate.addEventListener("click", (e) =>{

    //If the user is currently logged in
    if (auth.currentUser){
      e.preventDefault();

      //The donation form is opened
      const donateForm = document.querySelector("#modal-donate");
      M.Modal.getInstance(donateForm).open();

    //Else, the user is presented with an error popup
    }else{
      openDonationPopup();
    }
  })
}

//The user is presented with an error popup if they attempt to donate to a campaign when they are not
//logged in
function openDonationPopup(){
  const modalBackground = document.querySelector(".modalBackdrop");
  modalBackground.style.display = "block";

  const popup = document.querySelector(".popupError");
  popup.classList.add("open-popupError");

  //When the continue button is clicked within the popup, the modal will close
  const continueBtn = popup.querySelector("#continueDonate")
  continueBtn.addEventListener("click", () => {
    modalBackground.style.display = "none";
    closeDonationPopup();
  })
}

//Closing the popup window
function closeDonationPopup(){
  const popup = document.querySelector(".popupError");
  popup.classList.remove("open-popupError");
}

//This function checks that a user has selected a valid reward from the list
function validateFormReward(){

  //Pull values from the form and document
  const donationForm = document.querySelector("#donateForm")
  const rewardSelected = donationForm.donationReward.value;
  const rewardsList = document.querySelector("#rewardDatalist");

   // Checks if the user selection is an option in the datalist
   for (var j = 0; j < rewardsList.options.length; j++) {
    if (rewardSelected == rewardsList.options[j].value) {
      return true;
    }
  }
  return false;
}

//This function checks if a user has donated a sufficient amount to avail of their selected
//reward
function validateFormDonation() {

  //Pulls necessary information from the form.
  const donationForm= document.querySelector("#donateForm")
  const rewardSelected = donationForm.donationReward.value;

  //If the reward selected is none, there is no lower bound on the donation
  if (rewardSelected == "None"){
    return true;
  }

  //The proposed donations and required donations are parsed to be able to compare them as
  //float numbers to two decimal places
  const donationProposed = parseFloat(donationForm.donationInput.value).toFixed(2);
  var donationRequired = rewardSelected.split(":");
  var donationAmountSplit = donationRequired[1];
  donationAmountSplit = donationAmountSplit.slice(0, -1);
  var donationAmountFloat = donationAmountSplit.trim();
  donationAmountFloat = parseFloat(donationAmountFloat).toFixed(2);

  if (Math.round(parseFloat(donationAmountFloat)*100000) > Math.round(parseFloat(donationProposed)*100000)){
    return false;
  }

  return true;
}

// If a page contains the donation modal, it will have access to this functionality
  if (document.querySelector("#modal-donate")){

    // Alter donation form heading to reflect campaign being donated to
    const donationHeading = document.querySelector("#donationHeading");
    const campaignDonate = localStorage.getItem("currentCampaignName");
    donationHeading.innerText = "Donate to "+ campaignDonate;

    const donateForm = document.querySelector('#donateForm');
    let collectionRef = collection(db, "campaigns",localStorage.getItem("currentCampaign"),"rewards");

    //Fill the datalist for rewards (i.e. the options in a drop down menu) depending on the
    //rewards made available by the campaign in question
    onSnapshot(collectionRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
         
        let rewardDatalist = document.querySelector("#rewardDatalist");
        
        // Note: Here, reward name includes the donation required to avoid the user having to check back
        let rewardName = doc.data().name + " (Required Donation: "+parseFloat(doc.data().donation).toFixed(2)+")";

        let rewardOption = document.createElement("option");
        rewardOption.setAttribute("value",rewardName);
        rewardOption.textContent = rewardName;
        rewardDatalist.appendChild(rewardOption);
        
        })
      });

    //When the donation form is submitted
    donateForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // If the user is currently logged in
      if (auth.currentUser) {
        
        //Checks if the user has selected a valid reward
        var validRewardSelected = validateFormReward();
        
        //If they have
        if (validRewardSelected){
          
          //Ensures any previous errors are cleared
          let invalidRewardDiv = document.querySelector(".invalidReward");
          invalidRewardDiv.classList.remove("display-error");
          invalidRewardDiv.innerHTML = "";

          //Checks if the user's donation amount is valid for the reward selected
          var validDonationForm = validateFormDonation();
        
        //If it is valid
        if (validDonationForm){

          //Ensures any previous errors are cleared
          let insufficientErrorDiv = document.querySelector(".insufficientDonation");
          insufficientErrorDiv.classList.remove("display-error");
          insufficientErrorDiv.innerHTML = "";

          // Information is pulled to store a record of the donation under the user's donation subcollection
          
          //User ID
          const userID = auth.currentUser.uid;

          //Processing time
          var processingTimeDate = new Date();
          var date = processingTimeDate.getFullYear()+"-"+(processingTimeDate.getMonth()+1)+"-"+processingTimeDate.getDate();
          var time = processingTimeDate.getHours() + ":" + processingTimeDate.getMinutes() + ":" + processingTimeDate.getSeconds();
          const processingTime = date+"_"+time;

          //Donation ID
          const donationID = userID+"_"+campaignDonate+"_"+processingTime;

          //Constructs new reference
          const userRef = doc(db, "users", userID, "donations",donationID)

          //Donation Amount
          const donationAmountFromForm = donateForm.donationInput.value;

          //Sets new reward document in the user's donations subcollecction
          setDoc(userRef, {
            donationAmount: donateForm.donationInput.value,
            donationTo: campaignDonate,
            reward: donateForm.donationReward.value,
            tip: donateForm.tipAmount.value,
            processedAt: processingTime
        
        }).then(() => {
          
          //Constructs new reference to store donation record under the campaign's donations subcollection
          const campaignID = localStorage.getItem("currentCampaign");
          const campRef = doc(db, "campaigns", campaignID, "donations",donationID)

          //Sets new reward document in the campaign's donations subcollection
          setDoc(campRef, {
              donationAmount: donateForm.donationInput.value,
              donationFrom: userID,
              reward: donateForm.donationReward.value,
              tip: donateForm.tipAmount.value,
              processedAt: processingTime
          
          }).then(async () => {

          //Updates the amount raised in the campaign's record

          const updateAmountRef = doc(db, "campaigns",campaignID);
          var nowRaisedFloat;
          
          //Retrives campaign document and pulls necessary information
          const updateDocFetch = await getDoc(updateAmountRef);
          const currentRaised = updateDocFetch.data().raised;

          //Parses current amount raised to a float number of two decimal places
          const currentRaisedFloat = parseFloat(currentRaised).toFixed(2);

          //Updates the amount raised
           nowRaisedFloat = (parseFloat(currentRaisedFloat)+ parseFloat(donationAmountFromForm)).toFixed(2);
    
          //Updates the campaign document with the new amount raised
          updateDoc(updateAmountRef, {
            raised: nowRaisedFloat,
          })
          .then(() => {

            //Popup saying donation has been processed successully appears
            openPopupDonationSuccess();
            const modal = document.querySelector('#modal-donate');
            M.Modal.getInstance(modal).close();
            donateForm.reset();
          })
            }).catch(err => {
              console.log(err.message);
            })

        }).catch(err => {
              console.log(err.message);
        })

      //If the donation is insufficient an error will be displayed
      } else{
        let insufficientErrorDiv = document.querySelector(".insufficientDonation");
        insufficientErrorDiv.classList.add("display-error");
        insufficientErrorDiv.innerHTML = "Donation amount insufficient for reward selected.";
      }
      
      //If the reward is invalid an error will be displayed
      } else{
        let invalidRewardDiv = document.querySelector(".invalidReward");
        invalidRewardDiv.classList.add("display-error");
        invalidRewardDiv.innerHTML = "Please select a reward from the list provided."; 
      }
    
    // If the user is not logged in, they will be presented with the error popup
    } else{
      openDonationPopup();
      const modal = document.querySelector('#modal-donate');
      M.Modal.getInstance(modal).close();
      donateForm.reset();
    }
  })
};

// Opens pop up in the event a donation has been processed successfully
function openPopupDonationSuccess(){

  const modalBackground = document.querySelector(".modalBackdrop");
  modalBackground.style.display = "block";

  const popup = document.querySelector(".popupDonateSuccess");
  popup.classList.add("open-popupDonateSuccess");

  const continueBtn = popup.querySelector("#continueDonationComplete")

  continueBtn.addEventListener("click", () => {
    modalBackground.style.display = "none";
    closePopupDonationSuccess();
    window.location.href = "campaignExplore.html";
  })
}

// Closes the successful donation popup
function closePopupDonationSuccess(){
  const popup = document.querySelector("#popupDonateSuccess");
  popup.classList.remove("open-popupDonateSuccess");
}


//  ################ RENDERING LANDING PAGE ################################################

// Sign up Button

if (document.querySelector(".signupButton")){

  //If a user clicks on the sign up button
  const signupButton = document.querySelector(".signupButton");
  signupButton.addEventListener("click", () => {

  //If a user is already signed in, they will be presented with a popup explaining they
  //cannot sign up
    if (auth.currentUser){
      openLandingPopup();

  //Otherwise, they will be redirected to the sign up page
    }else{
      window.location.href = "signup.html";
    }
  })
}

//Opens pop up when a logged in user attempts to sign up
function openLandingPopup() {
  const modalBackground = document.querySelector(".modalBackdrop");
  modalBackground.style.display = "block";

  const popup = document.querySelector(".popupLanding");
  popup.classList.add("open-popupLanding");

  //Closes the pop up when a user clicks the continue button
  const continueBtn = popup.querySelector("#continueLanding")
  continueBtn.addEventListener("click", () => {
    closeLandingPopup();
    modalBackground.style.display = "none";
  })
}

//Closes the popup
function closeLandingPopup(){
  const popup = document.querySelector("#popupLanding");
  popup.classList.remove("open-popupLanding");
}

// Displaying the three most recent campaigns
if (document.querySelector(".landingPageCampaigns")){

  //Queries the campaigns collection for the most recent documents to be added
  const colRef = collection(db, "campaigns");
  const landingQ = query(colRef, orderBy("createdAt", "desc"), limit(3));

  //Fetches each document and renders them for display on the interface
  const querySnapshot = onSnapshot(landingQ, (querySnapshot) => {
    querySnapshot.forEach((doc) => {

      //Same function as before to render campaign cards
      renderCampaignCard(doc,"landingPageCampaigns");
    })
  })  
}


//Adding documents

/*
if (document.querySelector("#create-form")){ 

  const addCampaignForm = document.querySelector("#create-form");

  
  const addRewardBtn = document.querySelector(".add");
  const removeRewardBtn = document.querySelector(".remove");
  localStorage.setItem("numberOfRewards",0);

  addRewardBtn.addEventListener("click", () =>{
    var newRewardForm = document.createElement("form");
    var currentRewards = parseInt(localStorage.getItem("numberOfRewards"));
    currentRewards = currentRewards + 1;
    localStorage.setItem("numberOfRewards",currentRewards);
    
    var rewardFormName = "reward"+currentRewards;
    newRewardForm.setAttribute("id",rewardFormName);

    var rewardName = document.createElement("input");
    rewardName.setAttribute("type","text");
    rewardName.setAttribute("name","rewardName");
    rewardName.setAttribute("class","name");
    rewardName.setAttribute("siz",50);
    rewardName.setAttribute("placeholder","Reward "+currentRewards+" Name");
    newRewardForm.appendChild(rewardName);

    var rewardAmount = document.createElement("input");
    rewardAmount.setAttribute("type","number");
    rewardAmount.setAttribute("name","rewardDonation");
    rewardAmount.setAttribute("class","donation");
    rewardAmount.setAttribute("siz",50);
    rewardAmount.setAttribute("placeholder","Required Donation");
    newRewardForm.appendChild(rewardAmount);

    var rewardDesc = document.createElement("input");
    rewardDesc.setAttribute("type","text");
    rewardDesc.setAttribute("name","rewardDesc");
    rewardDesc.setAttribute("class","desc");
    rewardDesc.setAttribute("siz",150);
    rewardDesc.setAttribute("placeholder","Reward "+currentRewards+" Description");
    newRewardForm.appendChild(rewardDesc);

    addCampaignForm.appendChild(newRewardForm);
    document.getElementById("removeReward").style.visibility = "visible";

  })

  removeRewardBtn.addEventListener("click", () =>{

    var input_tags = addCampaignForm.getElementsByTagName("input");
    var deleteFormName = "#reward"+localStorage.getItem("numberOfRewards");
    var rewardForm = addCampaignForm.querySelector(deleteFormName);
    
    console.log("number of inputs tags:", input_tags.length);
    if (input_tags.length > 8) {
     
      addCampaignForm.removeChild(rewardForm);
  
      var currentRewards = parseInt(localStorage.getItem("numberOfRewards"));
      currentRewards = currentRewards - 1;
      localStorage.setItem("numberOfRewards",currentRewards);

      if (currentRewards == 0){
        document.getElementById("removeReward").style.visibility = "hidden";
      }
     
    }else{
      //let rewardBtn = addCampaignForm.querySelector("#removeReward");
    }

  })

  addCampaignForm.addEventListener("submit",(e) =>{
    e.preventDefault()
    const imageSrc = ref(storage,localStorage.getItem("imageStorageRef"));
    let imageURL = "";
    const campaignName = addCampaignForm.name.value;
    const campaignOwner = auth.currentUser.uid;
    const idNew = campaignName+campaignOwner+(Math.round(Math.random() * 9999));
    localStorage.setItem("newCampaign",idNew);
    
    getDownloadURL(imageSrc)
    .then((url) => {
      imageURL = url.toString();
      console.log("The url is: "+imageURL);
      console.log("The type is: "+ typeof imageURL);

      const colRef = collection(db, "campaigns");
      const newCampRef = doc(db,"campaigns",idNew);
      const serverCreationTime = serverTimestamp();

      setDoc(newCampRef, {
        bankCountry: addCampaignForm.bankCountry.value,
        category: addCampaignForm.category.value,
        country: addCampaignForm.country.value,
        description: addCampaignForm.description.value,
        image: imageURL,
        name: addCampaignForm.name.value,
        raised: addCampaignForm.raised.value,
        target: addCampaignForm.target.value,
        createdAt: serverCreationTime,
        user: auth.currentUser.uid,
    })
    .then(() => {
      //addCampaignForm.reset();

      const noOfRewards = localStorage.getItem("numberOfRewards");
  
      if (noOfRewards != 0){
    
  
    
        for (let i = 1; i <= noOfRewards; i++){
    
          var rewardForm = document.querySelector("#reward"+i);
          let rewardId = Math.round(Math.random() * 9999) + rewardForm.rewardName.value;
          let rewardSubRef = doc(db, "campaigns",idNew,"rewards",rewardId);
    
          setDoc(rewardSubRef, {
            uid: rewardId,
            name: rewardForm.rewardName.value,
            donation: rewardForm.rewardDonation.value,
            description: rewardForm.rewardDesc.value,
        })
          .then(() => {
            const userIDCurrent = auth.currentUser.uid;
            const newUserRef = doc(db,"users",userIDCurrent,"campaigns",idNew);

            setDoc(newUserRef, {
             name: addCampaignForm.name.value,
            createdAt: serverCreationTime,
           }).then(() =>  {
            addCampaignForm.reset();
            addCampaignForm.removeChild(rewardForm);

              })
            
    
          }).catch(err => {
            console.log(err.message);
          })
          
    
        }
        
      }
    
      document.getElementById("removeReward").style.visibility = "hidden";
    }).catch(err => {
      console.log(err.message);
    })


    }) .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
  
        // ...
  
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
    //const imageURL = URL.createObjectURL(imageSrc);
    
   /* addDoc(colRef, {
      bankCountry: addCampaignForm.bankCountry.value,
      category: addCampaignForm.category.value,
      country: addCampaignForm.country.value,
      description: addCampaignForm.description.value,
      image: imageURL,
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

}*/


//tring to work out image upload

/*
if (document.querySelector("#imageUpload")){
  const inp = document.querySelector(".inp");
  const progressbar = document.querySelector(".progress");
  const img = document.querySelector(".img");
  const fileData = document.querySelector(".filedata");
  const loading = document.querySelector(".loading");
  let file;
  let fileName;
  let progress;
  let isLoading = false;
  let uploadedFileName;
  
  inp.addEventListener("click", () => {
    inp.click();
  });

  var currentFile;

  //let selectImageBtn = document.querySelector("#selectImageBtn");
  inp.addEventListener("change", function() {
    if (this.files && this.files[0]) {

      var img = document.querySelector("#campaignImage");

      img.onload = () => {
        URL.revokeObjectURL(img.src);
      }

      img.src = URL.createObjectURL(this.files[0]);
      file = this.files[0];
      fileName = Math.round(Math.random() * 9999) + file.name;
      if (fileName) {
        fileData.style.display = "block";
      }
      fileData.innerHTML = fileName;
      console.log(file, fileName);

    }

  });*/

  /*

  let uploadImageBtn = document.querySelector("#uploadBtn");
  uploadImageBtn.addEventListener("click", () => {
    loading.style.display = "block";
    const storageRef = ref(storage, "campaignImages");
    const folderRef = ref(storageRef, fileName);
    const fileRef = "campaignImages/"+fileName;
    const docRef = ref(storage, fileRef);
    console.log("The ref is: "+docRef);
   // const uploadtask = uploadBytes(folderRef, file);
    localStorage.setItem("imageStorageRef",docRef);

    uploadBytes(folderRef, file).then((snapshot) =>  {
        console.log("Snapshot", snapshot.ref.name);
        progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress = Math.round(progress);
        progressbar.style.width = progress + "%";
        progressbar.innerHTML = progress + "%";
        uploadedFileName = snapshot.ref.name;
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("campaignImages")
          .child(uploadedFileName)
          .getDownloadURL()
          .then((url) => {
            console.log("URL", url);
            if (!url) {
              img.style.display = "none";
            } else {
              img.style.display = "block";
              loading.style.display = "none";
            }
            img.setAttribute("src", url);
          });
        console.log("File Uploaded Successfully");
      }
    );

  })
}
*/

//Getting data from user uploaded image

/*
function getImageData(e) {
  file = e.target.files[0];
  fileName = Math.round(Math.random() * 9999) + file.name;
  if (fileName) {
    fileData.style.display = "block";
  }
  fileData.innerHTML = fileName;
  console.log(file, fileName);
};

//uploading image to storage

function uploadImage() {
  loading.style.display = "block";
  const storageRef = storage.ref().child("myimages");
  const folderRef = storageRef.child(fileName);
  const uploadtask = folderRef.put(file);
  uploadtask.on(
    "state_changed",
    (snapshot) => {
      console.log("Snapshot", snapshot.ref.name);
      progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progress = Math.round(progress);
      progressbar.style.width = progress + "%";
      progressbar.innerHTML = progress + "%";
      uploadedFileName = snapshot.ref.name;
    },
    (error) => {
      console.log(error);
    },
    () => {
      storage
        .ref("myimages")
        .child(uploadedFileName)
        .getDownloadURL()
        .then((url) => {
          console.log("URL", url);
          if (!url) {
            img.style.display = "none";
          } else {
            img.style.display = "block";
            loading.style.display = "none";
          }
          img.setAttribute("src", url);
        });
      console.log("File Uploaded Successfully");
    }
  );
};*/


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

//  ################ RENDERING ACCOUNT PAGE ################################################


if (document.querySelector("#userAccountInfo")){

  //When a user logs in or logs out, the account page is updated accordingly
  onAuthStateChanged(auth, (user) => {
    fillAccountPage(user);
  })
}

function openAccountPopup(){
  const modalBackground = document.querySelector(".modalBackdrop");
  modalBackground.style.display = "block";

  const popup = document.querySelector(".popupErrorAccount");
  popup.classList.add("open-popupErrorAccount");

  //When the continue button is clicked within the popup, the modal will close
  const continueBtn = popup.querySelector("#continueAccount")
  continueBtn.addEventListener("click", () => {
    modalBackground.style.display = "none";
    closeAccountPopup();
    window.location.href="index.html";
  })
}

//Closing the popup window
function closeAccountPopup(){
  const popup = document.querySelector(".popupErrorAccount");
  popup.classList.remove("open-popupErrorAccount");
}

//Fills the account page with the user's information
function fillAccountPage(user){

  if (user) {

    //Fetching user account information
    const userRef = doc(db, "users", user.uid)

    getDoc(userRef).then((doc) =>{

    //Name
    let nameDiv = document.querySelector("#userFullName");
    let name = document.createElement("h2");
    name.textContent = doc.data().firstName+" "+doc.data().lastName;
    nameDiv.appendChild(name);

    //Username
    let username = document.createElement("h3");
    username.textContent = "@"+doc.data().username;
    nameDiv.appendChild(username);

    //User bio
    let bioDiv = document.querySelector("#userBio");
    let bioTxt = document.createElement("p");
    bioTxt.textContent = doc.data().bio;
    bioDiv.appendChild(bioTxt);

   })


  //Fetches any campaigns a user has started
  const campRef = collection(db, "users", user.uid,"campaigns")
  onSnapshot(campRef, (snapshotDocs) => {

    // If the user has not started any campaigns
    if (snapshotDocs.empty){
      let docDiv = document.querySelector("#userCampaigns");
      let messageNoCampaigns = document.createElement("h5");
      messageNoCampaigns.setAttribute("id","noUserCampaigns");
      messageNoCampaigns.textContent = "You have no active campaigns :("
      docDiv.appendChild(messageNoCampaigns);
    }else{

      //Removes no campaigns message if the user has started a campaign
      if (document.querySelector("#noUserCampaigns")){
        let noCampaignsMsg = document.querySelector("#noUserCampaigns");
        document.removeChild(noCampaignsMsg);
      }
    // Presents a campaign summary on the screen for each campaign
    // a user has started
      snapshotDocs.docs.forEach(docSnap =>{
        campaignSummary(docSnap);
      })
    } 
  })

    //Fetches any donations a user has made
  const donationsRef = collection(db, "users",user.uid,"donations");

  onSnapshot(donationsRef, (snapshotDons) => {

    // If the user has not made any donations
    if (snapshotDons.empty){
      let docDiv = document.querySelector("#userDonations");
      let messageNoDonations = document.createElement("h5");
      messageNoDonations.setAttribute("id","noUserDonations");
      messageNoDonations.textContent = "You have not donated to any campaigns :("
      docDiv.appendChild(messageNoDonations);

    }else{

      //Removes no donations message if there are donations
      if (document.querySelector("#noUserDonations")){
        let noDonationsMsg = document.querySelector("#noUserDonations");
        document.removeChild(noDonationsMsg);
      }

       // Presents a donation summary on the screen for each donation
       // made by a user
       snapshotDons.docs.forEach(donSnap => {
        donationSummary(donSnap);
       })
    }
  })
  }else{
    openAccountPopup();
  }
}

//This function generates a summary of a campaign
function campaignSummary(doc){

  let docDiv = document.querySelector("#userCampaigns");

  // Initialises div container
  let campContainer = document.createElement("div");
  campContainer.setAttribute("class","campContainer");
  
  // Campaign name
  let name = document.createElement("h4");
  name.textContent = doc.data().name;
  
  //Edit button
  let editButton = document.createElement("button");
  editButton.textContent = "Edit";
  
  //Store id
  let idCurrent = doc.id;

  //When the edit button is clicked
  editButton.addEventListener("click", () => {
    
    //Campaign information stored in local storage
    localStorage.setItem("campaignToUpdate",doc.data().name);
    localStorage.setItem("updateCampaignId",idCurrent);
    
    //User is redirected to campaignEdit page
    window.location.href = "campaignEdit.html";

    });

    //Add elements to page
    campContainer.appendChild(name);
    campContainer.appendChild(editButton);
    docDiv.appendChild(campContainer);
}

function donationSummary(doc){


  // Initialises div containers

  let donationContainer = document.createElement("div");
  donationContainer.setAttribute("class","donationContainer");

  let donationAmountDiv = document.createElement("div");
  donationAmountDiv.setAttribute("class","rewardDonationDiv");
  
  //Each donation document in the subcollection is fetched and
  //presented on the interface

  let donationList = document.querySelector("#donationsList");
  let listElement = document.createElement("li");

  // Campaign name
  let title = document.createElement("h4");
  title.textContent = "Donation to: "+doc.data().donationTo;
 
  let donationDivDescription = document.createElement("div");
  donationDivDescription.setAttribute("class","rewardDescriptionDiv");
   

  let donation = document.createElement("button");
  donation.disabled = true;
  donation.setAttribute("class","donationAmount");
  const donationRounded = (Math.round(doc.data().donationAmount * 100) / 100).toFixed(2);
  donation.textContent = donationRounded + " ";

  let donationButtonDivCenter = document.createElement("div");
  donationButtonDivCenter.setAttribute("class","center");
   
  let descriptionReward = document.createElement("p");
  descriptionReward.textContent = "Reward: "+doc.data().reward;

  let donationTime = document.createElement("p");
  let timeObj = doc.data().processedAt;

  var timeObjArr = timeObj.split("_");
  donationTime.textContent = "Date: "+timeObjArr[0];


   donationDivDescription.appendChild(title);
   //donationButtonDivCenter.appendChild(donation);
  // donationAmountDiv.appendChild(donationButtonDivCenter);
   donationDivDescription.appendChild(descriptionReward);
   donationContainer.appendChild(donationAmountDiv);
   donationContainer.appendChild(donation);
   donationContainer.appendChild(donationDivDescription);
   
   donationContainer.setAttribute("class","donationContainer");

   //Finally, the reward is added to the document
   listElement.appendChild(donationContainer);
   donationList.appendChild(listElement);
}


// get a single document
/*

const docRef = doc(db, "campaigns", "tcuu8dymVtGuDJqipsa3")

onSnapshot(docRef, (doc) =>{
  console.log(doc.data(), doc.id)
})*/


// updating a document
/*
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

function processUpdate(){
  if (document.querySelector("#modal-update")){
    const updateHeading = document.querySelector("#updateHeading");
    const campaignUpdate = localStorage.getItem("campaignToUpdate");
    campaignHeading.innerText = "Update "+ campaignUpdate;
    const updateForm = document.querySelector('#updateForm');

    const updateID = localStorage.getItem("updateCampaignId");
    let docRef = doc(db, "campaigns",updateID);

      onSnapshot(collectionRef, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log("data: ",doc.data());
          let rewardDiv = document.querySelector("#donateForm");
          let rewardName = doc.data().name;
      
          let rewardDatalist = document.querySelector("#rewardDatalist");

          let rewardOption = document.createElement("option");
          rewardOption.setAttribute("value",rewardName);
          rewardOption.textContent = rewardName;

          rewardDatalist.appendChild(rewardOption);

         } )});

     donateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (auth.currentUser) {
          //store a record of the donation under the user information in firestore database
          const userID = auth.currentUser.uid;
          var processingTimeDate = new Date();
          var date = processingTimeDate.getFullYear()+"-"+(processingTimeDate.getMonth()+1)+"-"+processingTimeDate.getDate();
          var time = processingTimeDate.getHours() + ":" + processingTimeDate.getMinutes() + ":" + processingTimeDate.getSeconds();
          const processingTime = date+"_"+time;
          const donationID = userID+"_"+campaignDonate+"_"+processingTime;
          const userRef = doc(db, "users", userID, "donations",donationID)

          setDoc(userRef, {
            donationAmount: donateForm.donationAmount.value,
            donationTo: campaignDonate,
            donationCurrency: donateForm.currency.value,
            reward: donateForm.reward.value,
            tip: donateForm.tipAmount.value,
            processedAt: processingTime
        
        }).then(() => {
      
        
        }).catch(err => {
          console.log(err.message);
        })

        //store a record of the donation under the campaign information in firestore database
        const campaignID = localStorage.getItem("currentCampaign");
        //const campRef = collection(db, "campaigns", campaignID, "donations")
        const campRef = doc(db, "campaigns", campaignID, "donations",donationID)

        setDoc(campRef, {
          donationAmount: donateForm.donationAmount.value,
          donationFrom: userID,
          donationCurrency: donateForm.currency.value,
          reward: donateForm.reward.value,
          tip: donateForm.tipAmount.value,
          processedAt: processingTime
      
      }).then(() => {
        const modal = document.querySelector('#modal-donate');
        M.Modal.getInstance(modal).close();
        donateForm.reset();
      }).catch(err => {
        console.log(err.message);
      })




      }
      })
       
}};*/

//Will fill page if it is identified as the single campaign page
if (document.querySelector("#editCampaignPage")){
 
  fillEditPage();

  let editBioBtn = document.querySelector("#editBioBtn");
 // let editImageBtn = document.querySelector("#editImageBtn");
  let editCategoryBtn = document.querySelector("#editCategoryBtn");
  let addRewardBtn = document.querySelector("#addRewardBtn");
  let inputFile = document.querySelector("#inputFile");
  let campaignImage = document.querySelector("#campaignImage");
  
  inputFile.addEventListener("change", () => {
    campaignImage.src = URL.createObjectURL(inputFile.files[0]);
    let file = inputFile.files[0];
    let fileName = Math.round(Math.random() * 9999) + file.name;

    console.log(file, fileName);

      const storageRef = ref(storage, "campaignImages");
      const folderRef = ref(storageRef, fileName);
      const fileRef = "campaignImages/"+fileName;
      const docRef = ref(storage, fileRef);
      console.log("The ref is: "+docRef);
     // const uploadtask = uploadBytes(folderRef, file);
      localStorage.setItem("imageStorageRef",docRef);
  
      uploadBytes(folderRef, file).then((snapshot) =>  {
          console.log("Snapshot", snapshot.ref.name);
          let uploadedFileName = snapshot.ref.name;
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("campaignImages")
            .child(uploadedFileName)
            .getDownloadURL()
            .then((url) => {
              console.log("URL", url);
              if (!url) {
                img.style.display = "none";
              } else {
                img.style.display = "block";
                loading.style.display = "none";

              }
              img.setAttribute("src", url);
            });
          console.log("File Uploaded Successfully");
        }
        
      ).then(() => {
        const imageSrc = ref(storage,localStorage.getItem("imageStorageRef"));
      let imageURL = "";
      
      getDownloadURL(imageSrc)
      .then((url) => {
        imageURL = url.toString();
        alert(imageURL);
  
        const docId = localStorage.getItem("updateCampaignId");
        const editDocRef = doc(db, "campaigns",docId);

  
        const newImage = imageURL;
    
        alert("image updated");

        updateDoc(editDocRef, {
          image: newImage
        })
        .then(() => {
          console.log("campaign was updated");
          
        

        })
  
      })

      })

  
  })
   



  editBioBtn.addEventListener("click", () => {
     const updateBioForm = document.querySelector("#modal-updateBio");
     M.Modal.getInstance(updateBioForm).open();
     //const docRef = doc(db, "campaigns", idCurrent)

  })

 /* editImageBtn.addEventListener("click", () => {
    const updateImageForm = document.querySelector("#modal-updateImage");
    M.Modal.getInstance(updateImageForm).open();
  })*/

  addRewardBtn.addEventListener("click", () => {
    const addRewardFormModal = document.querySelector("#modal-updateReward");
    M.Modal.getInstance(addRewardFormModal).open();
  })

  editCategoryBtn.addEventListener("click", () => {
    const editCategoryModal = document.querySelector("#modal-updateCategory");
    M.Modal.getInstance(editCategoryModal).open();
  })

}

//updating campaign bio
if (document.querySelector("#modal-updateBio")){
  
  const updateBioForm = document.querySelector("#updateBio-form");
  const docId = localStorage.getItem("updateCampaignId");
  const editDocRef = doc(db, "campaigns",docId);

  updateBioForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //get new name

    const newBio = updateBioForm["bio"].value;

    updateDoc(editDocRef, {
      description: newBio
    })
    .then(() => {
      updateBioForm.reset();
      const updateBioFormModal = document.querySelector("#modal-updateBio");
      M.Modal.getInstance(updateBioFormModal).close();
      location.reload();
    })

  })

};

//updating campaign category
if (document.querySelector("#modal-updateCategory")){
  
  const updateCategoryForm = document.querySelector("#updateCategory-form");
  const docId = localStorage.getItem("updateCampaignId");
  const editDocRef = doc(db, "campaigns",docId);

  updateCategoryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //get new name

    const newCategory = updateCategoryForm["category"].value;

    updateDoc(editDocRef, {
      category: newCategory
    })
    .then(() => {
      updateCategoryForm.reset();
      const updateCategoryFormModal = document.querySelector("#modal-updateCategory");
      M.Modal.getInstance(updateCategoryFormModal).close();
      location.reload();
    })

  })

};

//adding new reward when editing
if (document.querySelector("#modal-updateReward")){
  
  const updateRewardForm = document.querySelector("#updateReward-form");
  const docId = localStorage.getItem("updateCampaignId");
  const editDocRef = collection(db, "campaigns",docId,"rewards");

  updateRewardForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //get new name

    const newName = updateRewardForm["rewardName"].value;
    const newDescription = updateRewardForm["rewardDescription"].value;
    const newDonation = updateRewardForm["rewardDonation"].value;

    addDoc(editDocRef, {
      name: newName,
      description: newDescription,
      donation: newDonation
    })
    .then(() => {
      updateRewardForm.reset();
      const updateRewardFormModal = document.querySelector("#modal-updateReward");
      M.Modal.getInstance(updateRewardFormModal).close();
      location.reload();
    })

  })

};

// updating campaign image
/*
if (document.querySelector("#modal-updateImage")){
  
  



  const updateImageForm = document.querySelector("#updateImageForm");
  const input = updateImageForm.querySelector("input");
  const output = updateImageForm.querySelector("output");
  let imagesArray = [];

  input.addEventListener("change", function () {
    const file = input.file;
    console.log(file);
  })*/

  /*

  const docId = localStorage.getItem("updateCampaignId");
  const editDocRef = doc(db, "campaigns",docId);

  const inp = document.querySelector(".inp");
  const progressbar = document.querySelector(".progress");
  const img = document.querySelector(".img");
  const fileData = document.querySelector(".filedata");
  const loading = document.querySelector(".loading");
  let file;
  let fileName;
  let progress;
  let isLoading = false;
  let uploadedFileName;
  
  inp.addEventListener("click", () => {
    inp.click();
  });

  var currentFile;

  //let selectImageBtn = document.querySelector("#selectImageBtn");
  inp.addEventListener("change", function() {
    if (this.files && this.files[0]) {

      var img = document.querySelector("#campaignImage");

      img.onload = () => {
        URL.revokeObjectURL(img.src);
      }

      img.src = URL.createObjectURL(this.files[0]);
      file = this.files[0];
      fileName = Math.round(Math.random() * 9999) + file.name;
      if (fileName) {
        fileData.style.display = "block";
      }
      fileData.innerHTML = fileName;
      console.log(file, fileName);

    }

  });

  let uploadImageBtn = document.querySelector("#uploadBtn");
  uploadImageBtn.addEventListener("click", () => {
    loading.style.display = "block";
    const storageRef = ref(storage, "campaignImages");
    const folderRef = ref(storageRef, fileName);
    const fileRef = "campaignImages/"+fileName;
    const docRef = ref(storage, fileRef);
    console.log("The ref is: "+docRef);
   // const uploadtask = uploadBytes(folderRef, file);
    localStorage.setItem("imageStorageRef",docRef);

    uploadBytes(folderRef, file).then((snapshot) =>  {
        console.log("Snapshot", snapshot.ref.name);
        progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress = Math.round(progress);
        progressbar.style.width = progress + "%";
        progressbar.innerHTML = progress + "%";
        uploadedFileName = snapshot.ref.name;
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("campaignImages")
          .child(uploadedFileName)
          .getDownloadURL()
          .then((url) => {
            console.log("URL", url);
            let imageURL = url;
            if (!url) {
              img.style.display = "none";
            } else {
              img.style.display = "block";
              loading.style.display = "none";
            }
            img.setAttribute("src", url);
          });

        console.log("File Uploaded Successfully");
        const imageSrc = ref(storage,localStorage.getItem("imageStorageRef"));
        let imageURL = "";
        
        getDownloadURL(imageSrc)
        .then((url) => {
          imageURL = url.toString();
    
          const updateImageForm = document.querySelector("#updateImage-form");
          const docId = localStorage.getItem("updateCampaignId");
          const editDocRef = doc(db, "campaigns",docId);

    
          const newImage = imageURL;
      
          alert("image updated");

          updateDoc(editDocRef, {
            image: newImage
          })
          .then(() => {
            
           /* updateImageForm.reset();
            const updateImageFormModal = document.querySelector("#modal-updateImage");
            M.Modal.getInstance(updateImageFormModal).close();*/
          // location.reload();*/

          /*
          })
    
        })
        
    
    
    
        
    
      })
      }
    );*/

 // }
/*
  updateImageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const imageSrc = ref(storage,localStorage.getItem("imageStorageRef"));
    let imageURL = "";
    
    getDownloadURL(imageSrc)
    .then((url) => {
      imageURL = url.toString();

      const updateBioForm = document.querySelector("#updateImage-form");
      const docId = localStorage.getItem("updateCampaignId");
      const editDocRef = doc(db, "campaigns",docId);

    updateImageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //get new name

    const newImage = imageURL;

    updateDoc(editDocRef, {
      image: newImage
    })
    .then(() => {
      updateImageForm.reset();
      const updateBioFormModal = document.querySelector("#modal-updateImage");
      M.Modal.getInstance(updateImageFormModal).close();
      location.reload();
    })

    })
    



    

  })

})*/


function fillEditPage(){
  let currentCampaign = localStorage.getItem("updateCampaignId");
    if (currentCampaign != null){

    const currentEditCampaignDoc = doc(db, "campaigns", currentCampaign);

    onSnapshot(currentEditCampaignDoc, (docSnap) =>{

      let titleDiv = document.querySelector("#campaignName");
      let title = document.createElement("h2");
      title.textContent = docSnap.data().name;
      titleDiv.appendChild(title);

      let bioDiv = document.querySelector("#campaignBio");
      let bio = document.createElement("p");
      bio.textContent = docSnap.data().description;
      bioDiv.appendChild(bio);

      let categoryDiv = document.querySelector("#campaignCategory");
      let category = document.createElement("h6");
      category.textContent = docSnap.data().category;
      categoryDiv.appendChild(category);

      let raisedDiv = document.querySelector("#raisedDiv");
      let targetDiv = document.querySelector("#targetDiv");
      let targetDoc = document.createElement("h5");
      let raisedDoc = document.createElement("h5");
      let progressBar = document.createElement("div");
      progressBar.setAttribute("class","progressBarInner");

      targetDoc.textContent = "Target: "+docSnap.data().target;
      raisedDoc.textContent = "Raised: "+docSnap.data().raised;
      let outerProgressBar = document.querySelector("#progressBarOuter");

      if (Math.round((docSnap.data().raised/docSnap.data().target)*100,2) <= 0){
        outerProgressBar.textContent = "0% raised";
      }
      else if (Math.round((doc.data().raised/doc.data().target)*100,2) >= 100){
        progressBar.textContent = "100% raised";
        progressBar.setAttribute("style","height: 24px; width: 100px");

      }
      else{
        let percentageComplete = (Math.round((docSnap.data().raised/docSnap.data().target)*100,2))+"%";
        progressBar.setAttribute("style","height: 24px; width:"+percentageComplete);
        progressBar.textContent = percentageComplete+" raised";
      }
      
      raisedDiv.appendChild(raisedDoc);
   
      outerProgressBar.appendChild(progressBar);
      targetDiv.appendChild(targetDoc);

      
      let imageDiv = document.querySelector("#campaignImage");
      let imageSrc = docSnap.data().image;

      imageDiv.setAttribute("src",imageSrc);
      let userUID = docSnap.data().user;

      console.log("the user is: ",docSnap.data().user);

      let collectionRef = collection(db, "campaigns",currentCampaign,"rewards");

      onSnapshot(collectionRef, (querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
          console.log("data: ",docSnapshot.data());
          let rewardDiv = document.querySelector("#rewards");
          let rewardList = rewardDiv.querySelector("#rewardList");

          let listElement = document.createElement("li");

          let rewardContainer = document.createElement("div");

          let rewardDivDonation = document.createElement("div");
          rewardDivDonation.setAttribute("class","rewardDonationDiv");

          let rewardDivDescription = document.createElement("div");
          rewardDivDescription.setAttribute("class","rewardDescriptionDiv");
          

          let rewardName = document.createElement("h5");
          let donation = document.createElement("button");
          donation.disabled = true;
          donation.setAttribute("class","donationAmount");

          let deleteBtn = document.createElement("button");
          deleteBtn.setAttribute("id","deleteRewardBtn");
          deleteBtn.innerText = "Delete";

          deleteBtn.addEventListener("click", () => {
            let currentCampaign = localStorage.getItem("updateCampaignId");
            let rewardId = docSnapshot.data().uid;
            alert(rewardId);

            let rewardDocRef = doc(db, "campaigns",currentCampaign,"rewards",rewardId);

            deleteDoc(rewardDocRef)
            .then(() => {
              location.reload();
            })


          })

          let rewardButtonDivCenter = document.createElement("div");
          rewardButtonDivCenter.setAttribute("class","center");
          //let currency = document.createElement("currency");
          let descriptionReward = document.createElement("p");


          rewardName.textContent = docSnapshot.data().name;
          const donationRounded = (Math.round(docSnapshot.data().donation * 100) / 100).toFixed(2);
          donation.textContent = donationRounded + " ";
          descriptionReward.textContent = docSnapshot.data().description;

          rewardDivDescription.appendChild(rewardName);
          rewardButtonDivCenter.appendChild(donation);
          rewardButtonDivCenter.appendChild(deleteBtn);
          rewardDivDonation.appendChild(rewardButtonDivCenter);
          rewardDivDescription.appendChild(descriptionReward);
          rewardContainer.appendChild(rewardDivDonation);
          rewardContainer.appendChild(rewardDivDescription);

          rewardContainer.setAttribute("class","rewardContainer");

          listElement.appendChild(rewardContainer);
          rewardList.appendChild(listElement);

          //alert("code running");
        });
      });

    
    })

    

    let titleDiv = document.querySelector("#campaignName");

    let title = document.createElement("h2");
  

  }

}






// HIDING NAV BAR LINKS

const loggedOutLinks = document.querySelectorAll(".logged-out");

const loggedInLinks = document.querySelectorAll(".logged-in");

const accountDetails = document.querySelector(".account-details");

const setupUI = (user) => {
  if (user) {
    //account information
    const userRef = doc(db, "users", user.uid)
    /*getDoc(userRef).then((doc) =>{
      const html = `
      <div> Logged in as ${user.email}</div>
      <div>${doc.data().bio}</div>
      `
    accountDetails.innerHTML = html;
    })*/


  
    //toggle UI elements
    loggedInLinks.forEach(item => item.style.display = "block");
    loggedOutLinks.forEach(item => item.style.display = "none");

  }
  else{
    //hide account info
    //accountDetails.innerHTML = "";

    //toggle UI elements
    loggedInLinks.forEach(item => item.style.display = "none");
    loggedOutLinks.forEach(item => item.style.display = "block");

  }
}


// NEW CREATE A CAMPAIGN FORM ////

var storageRefCamp, folderRefCamp, fileRefCamp, fileCamp;


//testing signing users up
if (document.querySelector("#createCampaignFormSteps")){
  const popupCamp = document.querySelector(".popupCamp");
  const createCampaignForm = document.querySelector("#createCampaignFormSteps");

  var currentTabCamp = 0; // Current tab is set to be the first tab (0)
  showTabCamp(currentTabCamp); // Display the current tab

  const prevBtnPageCamp = document.querySelector("#prevBtnCamp");
  const nextBtnPageCamp = document.querySelector("#nextBtnCamp");

  prevBtnPageCamp.addEventListener("click", () => {
    nextPrevCamp(-1);
  })

  nextBtnPageCamp.addEventListener("click", () => {
    nextPrevCamp(1);
  })


  const addRewardBtn = document.querySelector(".addCamp");
  const removeRewardBtn = document.querySelector(".removeCamp");
  
  localStorage.setItem("numberOfRewards",0);

  addRewardBtn.addEventListener("click", () =>{
    const rewardFormsDiv = document.querySelector(".rewardForms");
    var newRewardForm = document.createElement("form");
    var currentRewards = parseInt(localStorage.getItem("numberOfRewards"));
    currentRewards = currentRewards + 1;
    localStorage.setItem("numberOfRewards",currentRewards);
    
    var rewardFormName = "reward"+currentRewards;
    newRewardForm.setAttribute("id",rewardFormName);

    var rewardName = document.createElement("input");
    rewardName.setAttribute("type","text");
    rewardName.setAttribute("name","rewardName");
    rewardName.setAttribute("class","name");
    rewardName.setAttribute("siz",50);
    rewardName.setAttribute("placeholder","Reward "+currentRewards+" Name");
    newRewardForm.appendChild(rewardName);

    var rewardAmount = document.createElement("input");
    rewardAmount.setAttribute("type","number");
    rewardAmount.setAttribute("step",0.01);
    rewardAmount.setAttribute("name","rewardDonation");
    rewardAmount.setAttribute("class","donation");
    rewardAmount.setAttribute("siz",50);
    rewardAmount.setAttribute("placeholder","Required Donation");
    newRewardForm.appendChild(rewardAmount);

    var rewardDesc = document.createElement("input");
    rewardDesc.setAttribute("type","text");
    rewardDesc.setAttribute("name","rewardDesc");
    rewardDesc.setAttribute("class","desc");
    rewardDesc.setAttribute("siz",150);
    rewardDesc.setAttribute("placeholder","Reward "+currentRewards+" Description");
    newRewardForm.appendChild(rewardDesc);

    rewardFormsDiv.appendChild(newRewardForm);
    document.getElementById("removeReward").style.visibility = "visible";

  })

  removeRewardBtn.addEventListener("click", () =>{
    
    const rewardFormsDiv = document.querySelector(".rewardForms");
    const addCampaignForm = document.getElementById("createCampaignFormSteps");
    var input_tags = addCampaignForm.getElementsByTagName("input");
    var deleteFormName = "#reward"+localStorage.getItem("numberOfRewards");
    var rewardForm = addCampaignForm.querySelector(deleteFormName);
    
    console.log("number of inputs tags:", input_tags.length);
    if (input_tags.length > 8) {
     
      rewardFormsDiv.removeChild(rewardForm);
  
      var currentRewards = parseInt(localStorage.getItem("numberOfRewards"));
      currentRewards = currentRewards - 1;
      localStorage.setItem("numberOfRewards",currentRewards);

      if (currentRewards == 0){
        document.getElementById("removeReward").style.visibility = "hidden";
      }
     
    }else{
      //let rewardBtn = addCampaignForm.querySelector("#removeReward");
    }

  })


  //TRYING UPLOAD IMAGE
  let inputFile = document.querySelector("#campaignImageFile");
  let campaignImage = document.querySelector("#campaignImage");
  
  inputFile.addEventListener("change", () => {
    campaignImage.src = URL.createObjectURL(inputFile.files[0]);
    campaignImage.setAttribute("style","visibility: visible");
    let fileCamp = inputFile.files[0];
    let fileNameCamp = Math.round(Math.random() * 9999) + fileCamp.name;

    console.log(fileCamp, fileNameCamp);

      storageRefCamp = ref(storage, "campaignImages");
      folderRefCamp = ref(storageRefCamp, fileNameCamp);
      fileRefCamp = "campaignImages/"+fileNameCamp;
      const docRefCamp = ref(storage, fileRefCamp);
      console.log("The ref is: "+docRefCamp);
     // const uploadtask = uploadBytes(folderRef, file);
      localStorage.setItem("imageStorageRef",docRefCamp);
      })

  createCampaignForm.addEventListener("submit", (e) => {


})

}

function openPopupCampaign(){
  const popup = document.querySelector(".popupCamp");
  popup.classList.add("open-popupCamp");
  //alert("open the popup");

  const continueBtn = popup.querySelector("#continueNewCampaign")

  continueBtn.addEventListener("click", () => {
    closePopupCampaign();
    window.location.href = "campaignExplore.html";
  })
}

function closePopupCampaign(){
  const popup = document.querySelector("#popupCamp");
  popup.classList.remove("open-popupCamp");
}

function showTabCamp(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtnCamp").style.display = "none";
  } else {
    document.getElementById("prevBtnCamp").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtnCamp").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtnCamp").innerHTML = "Next";
  }
  // ... and run a function that displays the correct step indicator:
  fixStepIndicatorCamp(n)
}

function nextPrevCamp(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateFormCamp()) return false;
  // Hide the current tab:
  x[currentTabCamp].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTabCamp = currentTabCamp + n;
  // if you have reached the end of the form... :
 
  if (currentTabCamp >= x.length) {
    //...the form gets submitted:
    let inputFile = document.querySelector("#campaignImageFile");
    const addCampaignForm = document.getElementById("createCampaignFormSteps");
    let campaignImage = document.querySelector("#campaignImage");


    campaignImage.src = URL.createObjectURL(inputFile.files[0]);
    campaignImage.setAttribute("style","visibility: visible");
    let fileCamp = inputFile.files[0];
    let fileNameCamp = Math.round(Math.random() * 9999) + fileCamp.name;

    console.log(fileCamp, fileNameCamp);

      storageRefCamp = ref(storage, "campaignImages");
      folderRefCamp = ref(storageRefCamp, fileNameCamp);
      fileRefCamp = "campaignImages/"+fileNameCamp;
      const docRefCamp = ref(storage, fileRefCamp);
      console.log("The ref is: "+docRefCamp);
     // const uploadtask = uploadBytes(folderRef, file);
      localStorage.setItem("imageStorageRef",docRefCamp);
      

    uploadBytes(folderRefCamp, fileCamp).then((snapshot) =>  {
      console.log("Snapshot", snapshot.ref.name);
      let uploadedFileNameCamp = snapshot.ref.name;
    },
    (error) => {
      console.log(error);
    },
    () => {
      storage
        .ref("campaignImages")
        .child(uploadedFileNameCamp)
        .getDownloadURL()
        .then((url) => {
          console.log("URL", url);
          if (!url) {
            img.style.display = "none";
          } else {
            img.style.display = "block";
            loading.style.display = "none";
          }
          img.setAttribute("src", url);
        });
      console.log("File Uploaded Successfully");
    }
    
  ).then(() => {
    const imageSrc = ref(storage,localStorage.getItem("imageStorageRef"));
    let imageURL = "";
  
    getDownloadURL(imageSrc)
    .then((url) => {
      imageURL = url.toString();

      const campaignName = addCampaignForm.campaignName.value;
      const campaignOwner = auth.currentUser.uid;
      const idNew = campaignName+campaignOwner+(Math.round(Math.random() * 9999));
      localStorage.setItem("newCampaign",idNew);

     console.log("The url is: "+imageURL);
     console.log("The type is: "+ typeof imageURL);

     const colRef = collection(db, "campaigns");
     const newCampRef = doc(db,"campaigns",idNew);
     const serverCreationTime = serverTimestamp();

     setDoc(newCampRef, {
       country: addCampaignForm.campaignCountry.value,
       category: addCampaignForm.campaignCategory.value,
       description: addCampaignForm.campaignDescription.value,
       image: imageURL,
       name: addCampaignForm.campaignName.value,
       raised: 0.00,
       target: addCampaignForm.campaignTarget.value,
       createdAt: serverCreationTime,
       user: auth.currentUser.uid
   }).then(() => {
      // close the signup modal & reset form
      //const modal = document.querySelector('#modal-signup');
      //M.Modal.getInstance(modal).close();

      const noOfRewards = localStorage.getItem("numberOfRewards");
  
      if (noOfRewards != 0){
    
        for (let i = 1; i <= noOfRewards; i++){
    
          var rewardForm = document.querySelector("#reward"+i);
          let rewardId = Math.round(Math.random() * 9999) + rewardForm.rewardName.value;
          let rewardSubRef = doc(db, "campaigns",idNew,"rewards",rewardId);
    
          setDoc(rewardSubRef, {
            uid: rewardId,
            name: rewardForm.rewardName.value,
            donation: rewardForm.rewardDonation.value,
            description: rewardForm.rewardDesc.value,
        })
          .then(() => {
            const userIDCurrent = auth.currentUser.uid;
            const newUserRef = doc(db,"users",userIDCurrent,"campaigns",idNew);

            setDoc(newUserRef, {
             name: addCampaignForm.name.value,
            createdAt: serverCreationTime,
           }).then(() =>  {
            addCampaignForm.reset();
            addCampaignForm.removeChild(rewardForm);

              })
            
    
          }).catch(err => {
            console.log(err.message);
          })
          
    
        }
        
      }
    
      document.getElementById("removeReward").style.visibility = "hidden";

    
      openPopupCampaign();

      const continueBtn = popup.querySelector("#continueNewCampaign")

      continueBtn.addEventListener("click", () => {
        closePopupCampaign();
        window.location.href = "campaignExplore.html";
        addCampaignForm.reset();
      })
      openPopupCampaign();
      addCampaignForm.reset();
      alert("Campaign created");

   });
  })

  })
   
   
   /*const imageSrc = ref(storage,localStorage.getItem("imageStorageRef"));
   let imageURL = "";*/

    //document.getElementById("regForm").submit();
     // get user info
  /* const email = regForm.email.value;
   const password = regForm.password.value;*/

 // sign up the user
 /*
   createUserWithEmailAndPassword(auth, email, password).then(async cred => {
     
     return await setDoc(doc(db, "users",cred.user.uid),{
      firstName: regForm.firstName.value,
      lastName: regForm.lastName.value,
      username: regForm.username.value,
      country: regForm.country.value,
      email: regForm.email.value,
      bio: regForm.bio.value,
     })
  
   }).then(() => {
      // close the signup modal & reset form
      //const modal = document.querySelector('#modal-signup');
      //M.Modal.getInstance(modal).close();
      openPopup();
      const modalBackground = document.querySelector(".modalBackdrop");

      modalBackground.style.display = "block";

      const continueBtn = popup.querySelector("#continueNewUser")

      continueBtn.addEventListener("click", () => {
        closePopup();
        window.location.href = "index.html";
        regForm.reset();
        document.getElementById("regForm").submit();
        modalBackground.style.display = "none";
        window.location.href = "index.html";
  })
      //regForm.reset();
      //alert("Sign up successful!");
     

   });*/



    return false;
  }
  // Otherwise, display the correct tab:
  showTabCamp(currentTabCamp);
}

function validateFormCamp() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTabCamp].getElementsByTagName("input");

  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }

  
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTabCamp].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicatorCamp(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}


//Adding documents

/*
if (document.querySelector("#createCampaignFormSteps")){ 

  const addCampaignForm = document.querySelector("#createCampaignFormSteps");

  
  const addRewardBtn = document.querySelector(".add");
  const removeRewardBtn = document.querySelector(".remove");
  localStorage.setItem("numberOfRewards",0);

  addRewardBtn.addEventListener("click", () =>{
    var newRewardForm = document.createElement("form");
    var currentRewards = parseInt(localStorage.getItem("numberOfRewards"));
    currentRewards = currentRewards + 1;
    localStorage.setItem("numberOfRewards",currentRewards);
    
    var rewardFormName = "reward"+currentRewards;
    newRewardForm.setAttribute("id",rewardFormName);

    var rewardName = document.createElement("input");
    rewardName.setAttribute("type","text");
    rewardName.setAttribute("name","rewardName");
    rewardName.setAttribute("class","name");
    rewardName.setAttribute("siz",50);
    rewardName.setAttribute("placeholder","Reward "+currentRewards+" Name");
    newRewardForm.appendChild(rewardName);

    var rewardAmount = document.createElement("input");
    rewardAmount.setAttribute("type","number");
    rewardAmount.setAttribute("name","rewardDonation");
    rewardAmount.setAttribute("class","donation");
    rewardAmount.setAttribute("siz",50);
    rewardAmount.setAttribute("placeholder","Required Donation");
    newRewardForm.appendChild(rewardAmount);

    var rewardDesc = document.createElement("input");
    rewardDesc.setAttribute("type","text");
    rewardDesc.setAttribute("name","rewardDesc");
    rewardDesc.setAttribute("class","desc");
    rewardDesc.setAttribute("siz",150);
    rewardDesc.setAttribute("placeholder","Reward "+currentRewards+" Description");
    newRewardForm.appendChild(rewardDesc);

    addCampaignForm.appendChild(newRewardForm);
    document.getElementById("removeReward").style.visibility = "visible";

  })

  removeRewardBtn.addEventListener("click", () =>{

    var input_tags = addCampaignForm.getElementsByTagName("input");
    var deleteFormName = "#reward"+localStorage.getItem("numberOfRewards");
    var rewardForm = addCampaignForm.querySelector(deleteFormName);
    
    console.log("number of inputs tags:", input_tags.length);
    if (input_tags.length > 8) {
     
      addCampaignForm.removeChild(rewardForm);
  
      var currentRewards = parseInt(localStorage.getItem("numberOfRewards"));
      currentRewards = currentRewards - 1;
      localStorage.setItem("numberOfRewards",currentRewards);

      if (currentRewards == 0){
        document.getElementById("removeReward").style.visibility = "hidden";
      }
     
    }else{
      //let rewardBtn = addCampaignForm.querySelector("#removeReward");
    }

  })*/



  /*
  addCampaignForm.addEventListener("submit",(e) =>{
    e.preventDefault()
    const imageSrc = ref(storage,localStorage.getItem("imageStorageRef"));
    let imageURL = "";
    const campaignName = addCampaignForm.name.value;
    const campaignOwner = auth.currentUser.uid;
    const idNew = campaignName+campaignOwner+(Math.round(Math.random() * 9999));
    localStorage.setItem("newCampaign",idNew);
    
    getDownloadURL(imageSrc)
    .then((url) => {
      imageURL = url.toString();
      console.log("The url is: "+imageURL);
      console.log("The type is: "+ typeof imageURL);

      const colRef = collection(db, "campaigns");
      const newCampRef = doc(db,"campaigns",idNew);
      const serverCreationTime = serverTimestamp();

      setDoc(newCampRef, {
        bankCountry: addCampaignForm.bankCountry.value,
        category: addCampaignForm.category.value,
        country: addCampaignForm.country.value,
        description: addCampaignForm.description.value,
        image: imageURL,
        name: addCampaignForm.name.value,
        raised: addCampaignForm.raised.value,
        target: addCampaignForm.target.value,
        createdAt: serverCreationTime,
        user: auth.currentUser.uid,
    })
    .then(() => {
      //addCampaignForm.reset();

      const noOfRewards = localStorage.getItem("numberOfRewards");
  
      if (noOfRewards != 0){
    
  
    
        for (let i = 1; i <= noOfRewards; i++){
    
          var rewardForm = document.querySelector("#reward"+i);
          let rewardId = Math.round(Math.random() * 9999) + rewardForm.rewardName.value;
          let rewardSubRef = doc(db, "campaigns",idNew,"rewards",rewardId);
    
          setDoc(rewardSubRef, {
            uid: rewardId,
            name: rewardForm.rewardName.value,
            donation: rewardForm.rewardDonation.value,
            description: rewardForm.rewardDesc.value,
        })
          .then(() => {
            const userIDCurrent = auth.currentUser.uid;
            const newUserRef = doc(db,"users",userIDCurrent,"campaigns",idNew);

            setDoc(newUserRef, {
             name: addCampaignForm.name.value,
            createdAt: serverCreationTime,
           }).then(() =>  {
            addCampaignForm.reset();
            addCampaignForm.removeChild(rewardForm);

              })
            
    
          }).catch(err => {
            console.log(err.message);
          })
          
    
        }
        
      }
    
      document.getElementById("removeReward").style.visibility = "hidden";
    }).catch(err => {
      console.log(err.message);
    })


    }) .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
  
        // ...
  
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
    //const imageURL = URL.createObjectURL(imageSrc);*/
    
   /* addDoc(colRef, {
      bankCountry: addCampaignForm.bankCountry.value,
      category: addCampaignForm.category.value,
      country: addCampaignForm.country.value,
      description: addCampaignForm.description.value,
      image: imageURL,
      name: addCampaignForm.name.value,
      raised: addCampaignForm.raised.value,
      target: addCampaignForm.target.value,
      createdAt: serverTimestamp()
  })
  .then(() => {
    addCampaignForm.reset();
  }).catch(err => {
    console.log(err.message);
  })*/

 
  
/*})

}*/




