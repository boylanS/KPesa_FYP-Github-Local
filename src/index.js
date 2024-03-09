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


  }else{
    console.log("user logged out.");

    setupUI();

   /* if (document.querySelector("#campaignDiv")){
      renderCampaign([]);
    }*/

  }

  
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

});

//testing signing users up


if (document.querySelector("#regForm")){
  const popup = document.querySelector(".popup");

  var currentTab = 0; // Current tab is set to be the first tab (0)
  showTab(currentTab); // Display the current tab

  const prevBtnPage = document.querySelector("#prevBtn");
  const nextBtnPage = document.querySelector("#nextBtn");

  prevBtnPage.addEventListener("click", () => {
    nextPrev(-1);
  })

  nextBtnPage.addEventListener("click", () => {
    nextPrev(1);
  })

  const regForm = document.querySelector("#regForm");

  regForm.addEventListener("submit", (e) => {
    e.preventDefault();
 
 // get user info
   const email = regForm.email.value;
   const password = regForm.password.value;

 // sign up the user
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

      const continueBtn = popup.querySelector("#continueNewUser")

      continueBtn.addEventListener("click", () => {
        closePopup();
        window.location.href = "index.html";
        regForm.reset();
  })
     // openPopup();
      //regForm.reset();
     // alert("Sign up successful!");

  
     


   });
});



}

function openPopup(){
  const popup = document.querySelector(".popup");
  popup.classList.add("open-popup");
  //alert("open the popup");

  const continueBtn = popup.querySelector("#continueNewUser")

  continueBtn.addEventListener("click", () => {
    closePopup();
    window.location.href = "index.html";
  })
}

function closePopup(){
  const popup = document.querySelector("#popup");
  popup.classList.remove("open-popup");
}

function showTab(n) {
  // This function will display the specified tab of the form ...
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

function nextPrev(n) {
  // This function will figure out which tab to display
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
    //document.getElementById("regForm").submit();
     // get user info
   const email = regForm.email.value;
   const password = regForm.password.value;

 // sign up the user
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
     

   });



    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
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

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}






// signing users up working
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
      loginForm.querySelector(".error").innerHTML = "";
    }).catch(err => {
      loginForm.querySelector(".error").innerHTML = "Error - email and/or password is incorrect.";
    })


  })



};

//logout
if (document.querySelector("#logout")){
  const logout = document.querySelector("#logout");
  logout.addEventListener("click", (e) =>{
    e.preventDefault();
    window.location.href = "index.html";
    signOut(auth);

  })


};
  

// FIRESTORE JAVASCRIPT

//collection ref
const colRef = collection(db, "campaigns");

//queries

const q = query(colRef, orderBy("createdAt"));

// real time collection data
/*
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
*/

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
      localStorage.setItem("currentCampaignName",doc.data().name)
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

//Will fill page if it is identified as the single campaign page
if (document.querySelector("#singleCampaignPage")){
  fillPage();
}

function fillPage(){
  
  let currentCampaign = localStorage.getItem("currentCampaign");
    if (currentCampaign != null){
    //alert("current campaign"+currentCampaign);

    //Calls the current campaign doc from the database
    const currentCampaignDoc = doc(db, "campaigns", currentCampaign);
    //const campaignSnap = getDoc(currentCampaignDoc);

    onSnapshot(currentCampaignDoc, (doc) =>{
      //console.log(doc.data(), doc.id)

      let titleDiv = document.querySelector("#campaignName");
      let title = document.createElement("h2");
      title.textContent = doc.data().name;
      titleDiv.appendChild(title);

      let bioDiv = document.querySelector("#campaignBio");
      let bio = document.createElement("p");
      bio.textContent = doc.data().description;
      bioDiv.appendChild(bio);

      let categoryDiv = document.querySelector("#campaignCategory");
      let category = document.createElement("h6");
      category.textContent = doc.data().category;
      categoryDiv.appendChild(category);

      let progressDiv = document.querySelector("#moneyDiv");
      let raisedDiv = document.querySelector("#raisedDiv");
      let targetDiv = document.querySelector("#targetDiv");
      let targetDoc = document.createElement("h5");
      let raisedDoc = document.createElement("h5");
      let progressBar = document.createElement("div");
      progressBar.setAttribute("class","progressBarInner");

      targetDoc.textContent = "Target: "+doc.data().target;
      raisedDoc.textContent = "Raised: "+doc.data().raised;
      let outerProgressBar = document.querySelector("#progressBarOuter");

      if (Math.round((doc.data().raised/doc.data().target)*100,2) <= 0){
        outerProgressBar.textContent = "0% raised";
      }
      else if (Math.round((doc.data().raised/doc.data().target)*100,2) >= 100){
        progressBar.textContent = "100% raised";
        progressBar.setAttribute("style","height: 24px; width: 100%");

      }
      else{
        let percentageComplete = (Math.round((doc.data().raised/doc.data().target)*100,2))+"%";
        progressBar.setAttribute("style","height: 24px; width:"+percentageComplete);
        progressBar.textContent = percentageComplete+" raised";
      }
      
      raisedDiv.appendChild(raisedDoc);
   
      outerProgressBar.appendChild(progressBar);
      targetDiv.appendChild(targetDoc);
      


      
      let imageDiv = document.querySelector("#campaignImage");
      let imageSrc = doc.data().image;

      imageDiv.setAttribute("src",imageSrc);
      let userUID = doc.data().user;

      console.log("the user is: ",doc.data().user);
      

      /*const subColRef = collection(db,"campaigns", currentCampaign,"rewards");

      const qSnap = getDocs(subColRef);

      console.log(qSnap.docs);*/




      /*

      getDoc(doc(db,"users",userUID))
        .then((doc) => {
          let userDiv = document.querySelector("#campaignOwner");
          let user = document.createElement("h6");
          user.textContent = doc.data().user;
          userDiv.appendChild(user);
        })*/

      let collectionRef = collection(db, "campaigns",currentCampaign,"rewards");

      onSnapshot(collectionRef, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log("data: ",doc.data());
          let rewardDiv = document.querySelector("#rewards");
          let rewardList = rewardDiv.querySelector("#rewardList");

          let listElement = document.createElement("li");

          let rewardContainer = document.createElement("div");

          let rewardDivDonation = document.createElement("div");
          rewardDivDonation.setAttribute("id","rewardDonationDiv");

          let rewardDivDescription = document.createElement("div");
          rewardDivDescription.setAttribute("id","rewardDescriptionDiv");
          

          let rewardName = document.createElement("h5");
          let donation = document.createElement("button");
          donation.disabled = true;
          donation.setAttribute("id","donationAmount");

          let rewardButtonDivCenter = document.createElement("div");
          rewardButtonDivCenter.setAttribute("class","center");
          //let currency = document.createElement("currency");
          let descriptionReward = document.createElement("p");


          rewardName.textContent = doc.data().name;
          const donationRounded = (Math.round(doc.data().donation * 100) / 100).toFixed(2);
          donation.textContent = donationRounded + " "+ doc.data().currency;
          descriptionReward.textContent = doc.data().description;

          rewardDivDescription.appendChild(rewardName);
          rewardButtonDivCenter.appendChild(donation);
          rewardDivDonation.appendChild(rewardButtonDivCenter);
          rewardDivDescription.appendChild(descriptionReward);
          rewardContainer.appendChild(rewardDivDonation);
          rewardContainer.appendChild(rewardDivDescription);

          rewardContainer.setAttribute("id","rewardContainer");

          listElement.appendChild(rewardContainer);
          rewardList.appendChild(listElement);

          //alert("code running");
        });
      });

      //const userRefCamp = doc(db,"users",userUID);

     /* getDoc(doc(db,"users",userUID))
        .then((doc) => {
          let userDiv = document.querySelector("#campaignOwner");
          let user = document.createElement("h6");
          user.textContent = doc.data().user;
          userDiv.appendChild(user);
        })*/

      /*let rewards = doc.data().collection("rewards");
      let rewardDiv = document.querySelector("#rewards");
      let rewardText = document.createElement("p");
      rewardText.textContent = rewards;
      rewardDiv.appendChild(rewardText);

      console.log(rewards);*/




     // alert("this also runs");

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

//Donation modal
if (document.querySelector("#donationButton")){
  const donate = document.querySelector("#donationButton");
  donate.addEventListener("click", (e) =>{
    if (auth.currentUser){
      e.preventDefault();
      console.log("the current user is:",auth.currentUser);
      const donateForm = document.querySelector("#modal-donate");
      M.Modal.getInstance(donateForm).open();
     // processDonation();
    }else{
      openDonationPopup();
      
    }
   
  })


};

function openDonationPopup(){
  const popup = document.querySelector(".popupError");
  popup.classList.add("open-popupError");
  //alert("open the popup");

  const continueBtn = popup.querySelector("#continueDonate")

  continueBtn.addEventListener("click", () => {
    closeDonationPopup();
  })
}


function closeDonationPopup(){
  const popup = document.querySelector(".popupError");
  popup.classList.remove("open-popupError");
}

function validateFormDonation() {
  // This function deals with validation of the form fields
  const donationForm= document.querySelector("#donateForm")
  const donationProposed = parseFloat(donationForm.donationAmount.value).toFixed(2);
  const rewardSelected = donationForm.donationReward.value;

  if (rewardSelected == "None"){
    return true;
  }

  var donationRequired = rewardSelected.split(":");
  console.log(donationRequired);
  var donationAmountSplit = donationRequired[1];
  console.log(donationAmountSplit);
  donationAmountSplit = donationAmountSplit.slice(0, -1);
  var donationAmountFloat = donationAmountSplit.trim();

  donationAmountFloat = parseFloat(donationAmountFloat).toFixed(2);
  console.log(donationAmountFloat);
  console.log(donationProposed);

  if (Math.round(parseFloat(donationAmountFloat)*100000) > Math.round(parseFloat(donationProposed)*100000)){
    return false;
  }

  return true;
}

//Processing the donation
//function processDonation(){
  if (document.querySelector("#modal-donate")){
    const donationHeading = document.querySelector("#donationHeading");
    const campaignDonate = localStorage.getItem("currentCampaignName");
    donationHeading.innerText = "Donate to "+ campaignDonate;
    const donateForm = document.querySelector('#donateForm');

    let collectionRef = collection(db, "campaigns",localStorage.getItem("currentCampaign"),"rewards");

      onSnapshot(collectionRef, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log("data: ",doc.data());
          let rewardDiv = document.querySelector("#donateForm");
          let rewardName = doc.data().name + " (Required Donation: "+parseFloat(doc.data().donation).toFixed(2)+")";
          let rewardDonationRequired = doc.data().donation;
      
          let rewardDatalist = document.querySelector("#rewardDatalist");

          let rewardOption = document.createElement("option");
          rewardOption.setAttribute("value",rewardName);
          rewardOption.setAttribute("class",rewardDonationRequired);
          rewardOption.textContent = rewardName;

          rewardDatalist.appendChild(rewardOption);
          console.log("this worked",rewardOption);

         } )});

     donateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (auth.currentUser) {

          var validDonationForm = validateFormDonation();
          console.log(validDonationForm);

         
          if (validDonationForm){

            let insufficientErrorDiv = document.querySelector(".insufficientDonation");
            insufficientErrorDiv.classList.remove("display-error");
            insufficientErrorDiv.innerHTML = "";
           

        
          //store a record of the donation under the user information in firestore database
          const userID = auth.currentUser.uid;
          var processingTimeDate = new Date();
          var date = processingTimeDate.getFullYear()+"-"+(processingTimeDate.getMonth()+1)+"-"+processingTimeDate.getDate();
          var time = processingTimeDate.getHours() + ":" + processingTimeDate.getMinutes() + ":" + processingTimeDate.getSeconds();
          const processingTime = date+"_"+time;
          const donationID = userID+"_"+campaignDonate+"_"+processingTime;
          const userRef = doc(db, "users", userID, "donations",donationID)
          const donationAmountFromForm = donateForm.donationAmount.value;

          setDoc(userRef, {
            donationAmount: donateForm.donationAmount.value,
            donationTo: campaignDonate,
            donationCurrency: donateForm.donationCurrency.value,
            reward: donateForm.donationReward.value,
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
          donationCurrency: donateForm.donationCurrency.value,
          reward: donateForm.donationReward.value,
          tip: donateForm.tipAmount.value,
          processedAt: processingTime
      
      }).then(async () => {

        const updateAmountRef = doc(db, "campaigns",campaignID);

        var nowRaisedFloat;

        const updateDocFetch = await getDoc(updateAmountRef);

        const currentRaised = updateDocFetch.data().raised;
        const currentRaisedFloat = parseFloat(currentRaised).toFixed(2);

        nowRaisedFloat = (parseFloat(currentRaisedFloat)+ parseFloat(donationAmountFromForm)).toFixed(2);
        console.log(nowRaisedFloat);

        updateDoc(updateAmountRef, {
          raised: nowRaisedFloat,
        })
        .then(() => {
          openPopupDonationSuccess();
          const modal = document.querySelector('#modal-donate');
          M.Modal.getInstance(modal).close();
          donateForm.reset();
        })

      
        
       
      }).catch(err => {
        console.log(err.message);
      })

      }else{
        let insufficientErrorDiv = document.querySelector(".insufficientDonation");
        insufficientErrorDiv.classList.add("display-error");
        insufficientErrorDiv.innerHTML = "Donation amount insufficient for reward selected.";
       
      }
    
    }
    })
};

function openPopupDonationSuccess(){
  alert("success!");
  const popup = document.querySelector(".popupDonateSuccess");
  popup.classList.add("open-popupDonateSuccess");

  const continueBtn = popup.querySelector("#continueDonationComplete")

  continueBtn.addEventListener("click", () => {
    closePopupDonationSuccess();
    window.location.href = "campaignExplore.html";
  })
}

function closePopupDonationSuccess(){
  const popup = document.querySelector("#popupDonateSuccess");
  popup.classList.remove("open-popupDonateSuccess");
}


// LANDING PAGE

// sign up button

if (document.querySelector(".signupButton")){
  const signupButton = document.querySelector(".signupButton");

  signupButton.addEventListener("click", () => {

    if (auth.currentUser){
      openLandingPopup();

    }else{
      window.location.href = "signup.html";
    }


  } )

}

function openLandingPopup() {
  const popup = document.querySelector(".popupLanding");
  popup.classList.add("open-popupLanding");
  //alert("open the popup");

  const continueBtn = popup.querySelector("#continueLanding")

  continueBtn.addEventListener("click", () => {
    closeLandingPopup();
  })
}

function closeLandingPopup(){
  const popup = document.querySelector("#popupLanding");
  popup.classList.remove("open-popupLanding");
}
// DISPLAY THE TOP 3 MOST RECENT CAMPAIGNS

if (document.querySelector(".landingPageCampaigns")){

  const colRef = collection(db, "campaigns");
  const landingQ = query(colRef, orderBy("createdAt", "desc"), limit(3));
  console.log(landingQ);

  const querySnapshot = onSnapshot(landingQ, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      renderCampaignLanding(doc);
    })

  }) 


  
}

function renderCampaignLanding(doc) {
  let landingPageDiv = document.getElementById("landingPageCampaigns");
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
      localStorage.setItem("currentCampaignName",doc.data().name)
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
     landingPageDiv.appendChild(floatContainer);

  

  } else{
    landingPageDiv.innerHTML=
    '<h5 class ="center-align">Login to view campaigns</h5>';
  }
}


//Adding documents
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
  })*/

 
  
})

}


//tring to work out image upload

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


//Getting data from user uploaded image
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
};


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


// FILL ACCOUNT PAGE INFO


if (document.querySelector("#userAccountInfo")){

  onAuthStateChanged(auth, (user) => {
    fillAccountPage(user);
  })


}

function fillAccountPage(user){

  if (user) {
    //account information
    const userRef = doc(db, "users", user.uid)
    getDoc(userRef).then((doc) =>{
    let nameDiv = document.querySelector("#userFullName");
    let name = document.createElement("h2");
    name.textContent = doc.data().firstName+" "+doc.data().lastName;
    nameDiv.appendChild(name);

    let username = document.createElement("h3");
    username.textContent = "@"+doc.data().username;
    nameDiv.appendChild(username);

    let bioDiv = document.querySelector("#userBio");
    let bioTxt = document.createElement("p");
    bioTxt.textContent = doc.data().bio;
    bioDiv.appendChild(bioTxt);

   /* let countryDiv = document.querySelector("#userCountry");
    let country = document.createElement("h6");
    country.textContent = "Country: "+doc.data().country;
    countryDiv.appendChild(country);*/


    })


    const campRef = collection(db, "users", user.uid,"campaigns")
    onSnapshot(campRef, (snapshotDocs) => {
      if (snapshotDocs.empty){
        let docDiv = document.querySelector("#userCampaigns");
        let messageNoCampaigns = document.createElement("h5");
        messageNoCampaigns.textContent = "You have no active campaigns :("
        docDiv.appendChild(messageNoCampaigns);
      }else{
        snapshotDocs.docs.forEach(docSnap =>{
          campaignCard(docSnap);
        })
      }
      
    })


  }else{
    alert(auth.currentUser);
  }

}

function campaignCard(doc){
  let docDiv = document.querySelector("#userCampaigns");

  if (doc.length != 0){
    alert("campaigns here");
    //WORKS WITH THE LIST 
    
    let campList = document.querySelector("#campaignList");


    let campContainer = document.createElement("div");
    campContainer.setAttribute("class","campContainer");
    //let buttonContainer = document.createElement("div");
    //buttonContainer.setAttribute("class","buttonContainer");


    //let campaign = document.createElement("div");
    //campaign.setAttribute("class","campaignSummary");
    let name = document.createElement("h4");
   // let description = document.createElement("p");
    let pageButton = document.createElement("button");

    let tempID = document.createElement("p");
    pageButton.textContent = "Edit";

    //li.setAttribute("data-id", doc.id);
    name.textContent = doc.data().name;
   // description.textContent = doc.data().description;
    console.log(doc.data());
    let idCurrent = doc.id;
  

    //currentCampaign = doc.id;

    pageButton.addEventListener("click", () => {
      //const updateForm = document.querySelector("#modal-update");
      localStorage.setItem("campaignToUpdate",doc.data().name);
      localStorage.setItem("updateCampaignId",idCurrent);
     // M.Modal.getInstance(donateForm).open();
      //const docRef = doc(db, "campaigns", idCurrent)
      window.location.href = "campaignEdit.html";

     /* updateDoc(docRef, {
        name: "updated name"
      })
      .then(() => {
        updateForm.reset();
      })*/
    });

    campContainer.appendChild(name);
    campContainer.appendChild(pageButton);
    //campContainer.appendChild(description);
   // buttonContainer.appendChild(pageButton);
  //  campaign.appendChild(pageButton);

  
   // campContainer.appendChild(campaign);
   // campContainer.appendChild(buttonContainer);
  
    docDiv.appendChild(campContainer);


  

  } else{
   
    let messageNoCampaigns = document.createElement("h5");
    messageNoCampaigns.textContent = "You have no active campaigns :("
    docDiv.appendChild(messageNoCampaigns);
  }
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

      let progressDiv = document.querySelector("#moneyDiv");
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
          rewardDivDonation.setAttribute("id","rewardDonationDiv");

          let rewardDivDescription = document.createElement("div");
          rewardDivDescription.setAttribute("id","rewardDescriptionDiv");
          

          let rewardName = document.createElement("h5");
          let donation = document.createElement("button");
          donation.disabled = true;
          donation.setAttribute("id","donationAmount");

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
          donation.textContent = donationRounded + " "+ docSnapshot.data().currency;
          descriptionReward.textContent = docSnapshot.data().description;

          rewardDivDescription.appendChild(rewardName);
          rewardButtonDivCenter.appendChild(donation);
          rewardButtonDivCenter.appendChild(deleteBtn);
          rewardDivDonation.appendChild(rewardButtonDivCenter);
          rewardDivDescription.appendChild(descriptionReward);
          rewardContainer.appendChild(rewardDivDonation);
          rewardContainer.appendChild(rewardDivDescription);

          rewardContainer.setAttribute("id","rewardContainer");

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




