function getOrCreateUserId() {
    let key = 'chat-userId'
    let id = localStorage.getItem(key);
    if (!id) {
        // Not cryptographically perfect, but totally fine for class projects
        id = 'u-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
        localStorage.setItem(key, id);
    }
    return id;
}

let nameInput = document.querySelector("#nameInput");


const myUserId = getOrCreateUserId();
console.log('My userId:', myUserId);
let myUsername = localStorage.getItem("chat-username");
if(myUsername){
    console.log('My username:', myUsername);
    nameInput.value = myUsername
}else{
    myUsername = "";
}

// start socket
if(location.hostname.toLowerCase().startsWith('browsercircus') || location.hostname.toLowerCase().startsWith('www')){
  socket = io({path: "/YOURPATH-and-PORT/socket.io"});  // yields '/leon/port-4100/socket.io' or '/socket.io'
}else{
  socket = io(); 
}

let myInfo = {
    userId: myUserId,
    username: myUsername
}
socket.emit('identify', myInfo);



nameInput.addEventListener("change", function(){
    console.log("changed name", nameInput.value)
    localStorage.setItem("chat-username", nameInput.value);
    socket.emit("name-change", {
        newUsername: nameInput.value
    })
})



let formeElm = document.querySelector("#chatForm");
console.log(formeElm);
let msgInput = document.querySelector("#newMessage");
console.log(msgInput)


// LISTEN FOR NEWLY TYPED MESSAGES, 
// SEND THEM TO THE SERVER
formeElm.addEventListener("submit", newMessagesSubmitted);

function newMessagesSubmitted(event){
    console.log(event);
    //stop form element from refreshing the page
    event.preventDefault();

    let newMsg = msgInput.value
    console.log(newMsg);

    // appendMessage(newMsg); // just for fun,
    // actuaally we need to
    // send the new message to 
    // the server first:
    socket.emit("message-from-client", {
        message: newMsg
    } );


    // clear out input:
    msgInput.value = "";

}


socket.on("message-from-server", function(data){
    // waht do to with the messaeg from server
    console.log("got message", data)
    appendMessage(data)
})


// LISTEN FOR NEW MESSAGES FROM SERVER
// APPEND THEM TO THE MESSAGE BOX
// AUTO SCROLL TO BOTTOM

socket.on("chat-history", function(data){
    // waht do to with the messaeg from server
    console.log("got chat history", data);
    for(d of data){
        appendMessage(d)
    }
    
})

// APPEND MESSAGES TO BOX
function appendMessage(data){
    // console.log(data)
    // select list (ul) first
    let chatThreadList = document.querySelector("#threadWrapper ul");
    console.log(chatThreadList)

    // create new list item (li)
    let newListItem = document.createElement("li");
    if(data.sender.userId == myUserId){
        newListItem.className = "fromMe"
    }else{
        newListItem.className = "fromOthers"
    }

    //sender
    let who = document.createElement("span");
    who.className = "who";
    who.innerText = data.sender.username || "anon";

    newListItem.append(who);

    //messsage
    let words = document.createElement("span");
    words.className = "words";
    words.innerText = data.message;

    newListItem.append(words);



    // append new li to the list 
    chatThreadList.append(newListItem);

    // scroll to bottom of textbox:
    chatThreadList.scrollTop = chatThreadList.scrollHeight;
}
