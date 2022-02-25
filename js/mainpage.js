import { getAuth} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getDatabase, ref, set, update, get, child, push } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";
function deleteAllChildNodes(parent){
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

}
function createGroups(displayName){
    const dbRef = ref(getDatabase());

    get(child(dbRef, `users/` + displayName + "/groups/userGroups")).then((snapshot) => {
        if (snapshot.exists()) {
            const sidenavCon = document.querySelector("#sidenavCon")
            let userGroups = snapshot.val()
            console.log(userGroups)
            for (let i = 0; i < userGroups.length; i++){
                let a = document.createElement("a")
                a.id = userGroups[i]
                a.textContent = userGroups[i]
                a.classList.add("options")
                a.style.marginTop = i ? "20px": "30px"
                a.addEventListener("click", function(){
                    let text = a.textContent
                    populateGroupPage(text)
                })
                sidenavCon.appendChild(a)

            }
        }
    })
}
function populateGroupPage(groupName){
    console.log(groupName)
}
//add something to make user groups change in database after joining/creating

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
const app = initializeApp(firebaseConfig);
const auth = getAuth();
// const user1 = auth.currentUser;
// user1.providerData.forEach((profile) => {
//   console.log(profile.displayName);
// });
let displayName = JSON.parse(localStorage.getItem("username")) 
createGroups(displayName)

console.log(displayName)
const create = document.querySelector("#create")
const privOrPub = document.querySelector("#privOrPub")
let check = false
privOrPub.addEventListener("click", function(){
    console.log("hi")
    const groupPass = document.querySelector("#groupPass")
    if (check == true){
        groupPass.setAttribute("style", "display:none;")
        groupPass.value = ""
        check = !(check)

    }
    else {
        groupPass.setAttribute("style", "display:block;")
        groupPass.value = ""

        check = !(check)

    }
})
const submitGroupForm = document.querySelector("#submitGroupForm")
submitGroupForm.addEventListener("click", function(){
    const groupName = document.querySelector("#groupName")
    console.log(groupName.value)
    const privOrPub = document.querySelector("#privOrPub")
    const database = getDatabase(app);

    if (!(privOrPub.checked)){
        const groupPass = document.querySelector("#groupPass")
        console.log(groupPass.value)
        set(ref(database, "groups/" + groupName.value), {
        groupName: groupName.value,
        public: false,
        password: groupPass.value,
        members: [displayName],
        
        });
        let arr = []
        console.log(displayName)
        const dbRef = ref(getDatabase());

        get(child(dbRef, "users/" + displayName + "/groups")).then((info) => {
            if (info.exists()){
                arr = info.val()["userGroups"]
                if (arr[0] == "hi"){
                    arr.pop()
                }
                console.log(arr)
                arr[arr.length] = groupName.value
                update(ref(database, "users/" + displayName + "/groups"), {
                    userGroups: arr,
                });
            }
            
            
        }).catch((error) => {
            console.error(error);
        });
        
    }
    else {
        set(ref(database, "groups/" + groupName.value), {
            groupName: groupName.value,
            public: true,
            members: [displayName],
            
        });
        let arr = []
        console.log(displayName)
        const dbRef = ref(getDatabase());

        get(child(dbRef, "users/" + displayName + "/groups")).then((info) => {
            if (info.exists()){
                arr = info.val()["userGroups"]
                if (arr[0] == "hi"){
                    arr.pop()
                }
                console.log(arr)
                arr[arr.length] = groupName.value
                update(ref(database, "users/" + displayName + "/groups"), {
                    userGroups: arr,
                });
            }
            
            
        }).catch((error) => {
            console.error(error);
        });
        
        
        

    }
})
create.addEventListener("click", function(){
    const createGroup = document.querySelector("#createGroup")
    createGroup.setAttribute("style", "display: block")
    const joinGroup = document.querySelector("#joinGroup")
    joinGroup.setAttribute("style", "display: none;")
    const joinGroupConfo = document.querySelector("#joinGroupConfo")
    joinGroupConfo.setAttribute("style", "display: none")
})
const join = document.querySelector("#join")
join.addEventListener("click", function(){
    const joinGroup = document.querySelector("#joinGroup")
    joinGroup.setAttribute("style", "display: block;")
    const createGroup = document.querySelector("#createGroup")
    createGroup.setAttribute("style", "display: none")
    const joinGroupConfo = document.querySelector("#joinGroupConfo")
    joinGroupConfo.setAttribute("style", "display: none")

    const searchGroups = document.querySelector("#searchGroups")
    searchGroups.oninput = findGroups
    function findGroups(){
        console.log(searchGroups.value)
        const dbRef = ref(getDatabase());
        let groupsObj = {}

        get(child(dbRef, `groups/`)).then((snapshot) => {
        if (snapshot.exists()) {
            deleteAllChildNodes(document.querySelector("#searchResults"))
            groupsObj = snapshot.val()
            for (let key in groupsObj){
                if (key.slice(0, searchGroups.value.length).toLowerCase() == searchGroups.value.toLowerCase()){
                    console.log(key)
                    createSearchResults(key)


                }
            
            }
            let searchResultItems = document.querySelectorAll(".searchResultItem")
            searchResultItems.forEach(searchResultItem => {
                searchResultItem.addEventListener('click', function (event) {
                    const groupName = searchResultItem.childNodes[0].textContent
                    if (groupsObj[groupName]["public"]) {
                        const joinGroupConfo = document.querySelector("#joinGroupConfo")
                        deleteAllChildNodes(joinGroupConfo)
                        joinGroupConfo.classList.remove("changeBackgroundGreen")
                        let button = document.createElement("button")
                        button.textContent = "Confirm"
                        button.classList.add("formEl");
                        button.setAttribute("style", "margin: 0 auto; margin-top: 30px")
                        let p = document.createElement("p")
                        p.textContent = "Are you sure you want to join?"
                        p.style.color = "white"
                        p.style.fontSize = "20px"

                        joinGroupConfo.appendChild(p)

                        joinGroupConfo.appendChild(button)
                        const joinGroup = document.querySelector("#joinGroup")
                        joinGroup.setAttribute("style", "display:none")
                        joinGroupConfo.setAttribute("style", "display:block")
                        console.log("pub")
                        button.addEventListener("click", function(){
                            console.log("hi")
                            const database = getDatabase(app);
                            let foundInGroupAlready = false
                            for (let i = 0; i < groupsObj[groupName]["members"].length; i++){
                                if (groupsObj[groupName]["members"][i] == displayName){
                                    foundInGroupAlready = true
                                }
                            }
                            if (foundInGroupAlready == false){
                                groupsObj[groupName]["members"].push(displayName)
                                update(ref(database, "groups/" + groupName ), {
                                    members: groupsObj[groupName]["members"],
                                });
                                let arr = []
                                console.log(displayName)
                                const dbRef = ref(getDatabase());
                        
                                get(child(dbRef, "users/" + displayName + "/groups")).then((info) => {
                                    if (info.exists()){
                                        arr = info.val()["userGroups"]
                                        if (arr[0] == "hi"){
                                            arr.pop()
                                        }
                                        arr[arr.length] = groupName
                                        console.log(arr)
                                        update(ref(database, "users/" + displayName + "/groups"), {
                                            userGroups: arr,
                                        });
                                    }
                                    
                                    
                                }).catch((error) => {
                                    console.error(error);
                                });
                                // update(ref(database, "users/" + displayName + "/groups" ), {
                                //     members: groupsObj[groupName]["members"],
                                // });
                            }          
                            if (!document.querySelector("#errorJoinGroup")){
                                let error = document.createElement("p")
                                error.style.color = "white"
                                error.style.fontSize = "20px"
                                error.style.marginLeft = "70px"
                                error.style.marginTop = "20px"
                                error.id = "errorJoinGroup"
                                error.textContent = "Group Joined!"
                                joinGroupConfo.appendChild(error)
                            }
                            joinGroupConfo.classList.add("changeBackgroundGreen")
                        })
                    }
                    else {
                        const joinGroupConfo = document.querySelector("#joinGroupConfo")
                        deleteAllChildNodes(joinGroupConfo)
                        joinGroupConfo.classList.remove("changeBackgroundGreen")
                        let input = document.createElement("input")
                        input.type = "password"
                        input.id = "pass"
                        input.classList.add("formEl")
                        input.placeholder = "Group Password"
                        input.setAttribute("style", "margin: 0 auto; margin-top: 30px")
                        let button = document.createElement("button")
                        button.textContent = "Confirm"
                        button.classList.add("formEl");
                        button.setAttribute("style", "margin: 0 auto; margin-top: 30px")
                        let p = document.createElement("p")
                        p.style.color = "white"
                        p.style.fontSize = "20px"
                        p.textContent = "Are you sure you want to join?"
                        joinGroupConfo.appendChild(p)
                        joinGroupConfo.appendChild(input)
                        joinGroupConfo.appendChild(button)
                        const joinGroup = document.querySelector("#joinGroup")
                        joinGroup.setAttribute("style", "display:none")
                        joinGroupConfo.setAttribute("style", "display:block")
                        button.addEventListener("click", function(){
                            if (input.value == groupsObj[groupName]["password"]){
                                console.log("true")
                                if (!(document.querySelector("#errorJoinGroup"))){
                                    let error = document.createElement("p")
                                    error.style.color = "white"
                                    error.style.fontSize = "20px"
                                    error.style.marginLeft = "70px"
                                    error.style.marginTop = "20px"
                                    error.id = "errorJoinGroup"
                                    error.textContent = "Group Joined!"
                                    joinGroupConfo.classList.add("changeBackgroundGreen")
                                    joinGroupConfo.appendChild(error)
                                    let foundInGroupAlready = false
                                    for (let i = 0; i < groupsObj[groupName]["members"].length; i++){
                                        if (groupsObj[groupName]["members"][i] == displayName){
                                            foundInGroupAlready = true
                                        }
                                    }
                                    if (foundInGroupAlready == false){
                                        groupsObj[groupName]["members"].push(displayName)
                                        const database = getDatabase(app);
                                        update(ref(database, "groups/" + groupName ), {
                                            members: groupsObj[groupName]["members"],
                                        });
                                        let arr = []
                                        console.log(displayName)
                                        const dbRef = ref(getDatabase());
                                
                                        get(child(dbRef, "users/" + displayName + "/groups")).then((info) => {
                                            if (info.exists()){
                                                arr = info.val()["userGroups"]
                                                if (arr[0] == "hi"){
                                                    arr.pop()
                                                }
                                                arr[arr.length] = groupName
                                                console.log(arr)
                                                update(ref(database, "users/" + displayName + "/groups"), {
                                                    userGroups: arr,
                                                });
                                            }
                                            
                                            
                                        }).catch((error) => {
                                            console.error(error);
                                        });

                                    }
                                    else {
                                        console.log("already in")
                                        // const database = getDatabase(app);
                                        // groupsObj[groupName]["members"].push(displayName)
                                        // update(ref(database, "groups/" + groupName ), {
                                        //     members: groupsObj[groupName]["members"],
                                        // });
                                    }
                                    //console.log(groupsObj[groupName]["members"])
                                }
                                else {
                                    let error = document.querySelector("#errorJoinGroup")
                                    error.style.color = "white"
                                    error.style.marginLeft = "70px"

                                    error.textContent = "Group Joined!"
                                    joinGroupConfo.classList.add("changeBackgroundGreen")

                                }
                            }
                            else {
                                if (!(document.querySelector("#errorJoinGroup"))){
                                    let error = document.createElement("p")
                                    error.style.color = "red"
                                    error.style.fontSize = "20px"
                                    error.style.marginLeft = "20px"
                                    error.style.marginTop = "20px"
                                    error.id = "errorJoinGroup"
                                    error.textContent = "Error - incorrect password"

                                    joinGroupConfo.appendChild(error)
                                }
                                

                            }
                        })
                        
                        

                        console.log("priv")
                    }
                    
                    
                });
            })
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
        });
        
    }
    function createSearchResults(key){

        let result = document.createElement("div")
        result.classList.add("searchResultItem")
        let p = document.createElement("p")
        p.textContent = key
        p.classList.add("searchResultContent")
        result.appendChild(p)
        const searchResults = document.querySelector("#searchResults")
        searchResults.appendChild(result)


    }
    

})