// socket connection that works locally and on server
// const socket = io();
// const prefix = location.pathname.replace(/\/$/, '');      // '' or '/name/port-4200'
const CUT = 1;  // 1 = go up one folder; 2 = two folders; etc.
const prefix = location.pathname.replace(/\/+$/,'').split('/').filter(Boolean).slice(0, -CUT).join('/');
// let socket;
console.log(prefix);
const socket = io({ path: prefix + '/socket.io' });

// let readyButton = document.querySelector("#ready");
let mainWrapper = document.querySelector(".main-wrapper")
let w = window.innerWidth;
let h = window.innerHeight;
let frogs = []
// let audioElm, imgElm;
// let frogIdx;

// readyButton.addEventListener("click", function(){
//     mainWrapper.append(imgElm);
//     readyButton.remove();

//     // connect to socket server
//     socket = io({ path: prefix + '/socket.io' });
socket.emit("my-role", {role: "conductor"});
 
socket.on("all-frogs", function(allFrogs){
    console.log(allFrogs);
    frogs = allFrogs;
    for(let i = 0; i < frogs.length; i++){
        let f = frogs[i]
        addFrog(f.id, f.frogIdx)
    }
})

socket.on("delete-frog", function(socketID){
    document.querySelector("#"+socketID).remove();
})

socket.on("new-frog", function(f){
    addFrog(f.id, f.frogIdx)
})

function addFrog(socketID, frogIdx){
    let imgWrapper = document.createElement("div");
    imgWrapper.className = "img-wrap"
    imgWrapper.id = socketID;
    imgElm = document.createElement("img");
    imgElm.src = "../imgs/frog"+frogIdx+".png";
    imgWrapper.append(imgElm)
    mainWrapper.append(imgWrapper);

    imgElm.addEventListener("click", function(){
        document.querySelector("#"+socketID).style.opacity = 0.3;
        setTimeout(function(){
            document.querySelector("#"+socketID).style.opacity = 1;
        }, 500)
        socket.emit("trigger-frog", socketID)
    })
}
    
//     // TESTING IF JS CAN PLAY THE AUDIO:
//     setTimeout(function(){
//         audioElm.play()
//     }, 100)
// })

// window.addEventListener("load", function(){
//     console.log("ready");
    
//     frogIdx = Math.floor(Math.random()*9);
    
//     console.log(frogIdx);

//     audioElm = document.createElement("audio");
//     audioElm.controls = true;
//     audioElm.id = "frogSound";
//     audioElm.innerHTML = `
//         <source src="sounds/f`+frogIdx+`.mp3" type="audio/mpeg">
//         Your browser does not support the audio element.
//     `

//     imgElm = document.createElement("img");
//     imgElm.src = "../imgs/frog"+frogIdx+".png";
//     imgElm.id = "frogImg";
//     let frogSize = 0;
//     if(w > h){
//         frogSize = Math.min(h, 400);

//     }else{
//         frogSize = Math.min(w, 400);
//     }
//     imgElm.width = frogSize;
//     imgElm.height = frogSize;

//     // imgElm.addEventListener("click", function(){
//     //     audioElm.play();
//     // })

//     audioElm.addEventListener("timeupdate", function(){
//         console.log(imgElm.width)
//         imgElm.width = imgElm.width+2;
//         imgElm.height = imgElm.height+2;
//     })
//     audioElm.addEventListener("ended", function(){
//         imgElm.width = frogSize;
//         imgElm.height = frogSize;
//     })


// })



// let formeElm = document.querySelector("#chatForm");
// console.log(formeElm);
// let msgInput = document.querySelector("#newMessage");
// console.log(msgInput)


// // LISTEN FOR NEWLY TYPED MESSAGES, 
// // SEND THEM TO THE SERVER
// formeElm.addEventListener("submit", newMessagesSubmitted);

// function newMessagesSubmitted(event){
//     console.log(event);
//     //stop form element from refreshing the page
//     event.preventDefault();

//     let newMsg = msgInput.value
//     console.log(newMsg);

//     appendMessage(newMsg); // just for fun,
//     // actuaally we need to
//     // send the new message to 
//     // the server first:
//     socket.emit("message", newMsg );


//     // clear out input:
//     msgInput.value = "";

// }


// socket.on("message-from-server", function(data){
//     // waht do to with the messaeg from server
// })


// // LISTEN FOR NEW MESSAGES FROM SERVER
// // APPEND THEM TO THE MESSAGE BOX
// // AUTO SCROLL TO BOTTOM

// // APPEND MESSAGES TO BOX
// function appendMessage(txt){
//     console.log(txt)
//     // select list (ul) first
//     let chatThreadList = document.querySelector("#threadWrapper ul");
//     console.log(chatThreadList)

//     // create new list item (li)
//     let newListItem = document.createElement("li");
//     newListItem.innerText = txt;

//     // append new li to the list 
//     chatThreadList.append(newListItem);

//     // scroll to bottom of textbox:
//     chatThreadList.scrollTop = chatThreadList.scrollHeight;
// }


// appendMessage("lalallalalalalalalala");


// OPTIONAL: LISTEN FOR NEW NAME
// SEND IT TO SERVER
