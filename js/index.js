import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";


function signup(){
  const signUp = document.querySelector("#signUp")
  signUp.setAttribute("style", "display: block")
  const login = document.querySelector("#login")
  login.setAttribute("style", "display:none")
}
function gobackLogin(){
  const signUp = document.querySelector("#signUp")
  signUp.setAttribute("style", "display: none")
  const login = document.querySelector("#login")
  login.setAttribute("style", "display:block")
}
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwzLrbKngskpH5PkeyaS-0Qbe23ATXk5o",
  authDomain: "fantasywordle.firebaseapp.com",
  databaseURL: "https://fantasywordle-default-rtdb.firebaseio.com",
  projectId: "fantasywordle",
  storageBucket: "fantasywordle.appspot.com",
  messagingSenderId: "244139830135",
  appId: "1:244139830135:web:943accedc58e5e20b08f72",
  measurementId: "G-RY6KWZQHS3"
};
const signUpButton = document.querySelector("#signUpButton")
signUpButton.addEventListener("click", function(){
  signup()
})
const goback = document.querySelector("#goback")
goback.addEventListener("click", function(){
  gobackLogin()
})

localStorage.clear()

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const submit = document.querySelector("#submit")
submit.addEventListener("click", function(){
    const user = document.querySelector("#user")
    let username = document.querySelector("#username")

    const pass = document.querySelector("#pass")
    let email = user.value;
    let password = pass.value;
    username = username.value
    if (username.trim() == "") {
      alert("enter a valid username")
      return
    }
    if (email.trim() == "") {
      alert("enter a valid email")
      return
    }
    if (password.length < 6){
      alert("password must be over 6 characters")
      return
    }
    const database = getDatabase(app);

    const dbRef = ref(getDatabase());

    get(ref(database, "users/" + username)).then((info) => {
      if (!(info.exists())){
        set(ref(database, "users/" + username), {
          username: username,
          email: email,
          password: password,
          groups: {userGroups: ["PLACEHOLDER"]}
          
        });
        createUserWithEmailAndPassword(auth, email, password, username)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          updateProfile(auth.currentUser, {
            displayName: username
          }).then(() => {
            console.log("created")
          }).catch((error) => {
            console.log(error)
          });
          
            
          const signUp = document.querySelector("#signUp")
          signUp.setAttribute("style", "display: none")
          const login = document.querySelector("#login")
          login.setAttribute("style", "display:block")
          // const db = getDatabase();
          // let firebaseRef = app.database().ref("emails")
          //firebaseRef.push("email")
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage)
          // ..
      });
      }
      else {
        alert("username already exists, pick another")
        return
      }
      
    }).catch((error) => {
        console.error(error);
    });
    
})
const submitLogin = document.querySelector("#submitLogin")
submitLogin.addEventListener("click", function(){
    const userLogin = document.querySelector("#userLogin")
    const passLogin = document.querySelector("#passLogin")
    let email = userLogin.value;
    let password = passLogin.value;
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("signed in")
    const login = document.querySelector("#login")
    login.setAttribute("style", "display:none")
    console.log("helo")
    const database = getDatabase(app);
    const user1 = auth.currentUser;
    let displayName
    user1.providerData.forEach((profile) => {
      displayName = (profile.displayName);
    });
    
    window.location = "mainpage.html"
    localStorage.setItem("username", JSON.stringify(displayName))


    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
})
