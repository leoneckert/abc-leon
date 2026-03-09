
let socket;
if(location.hostname.toLowerCase().startsWith('browsercircus') || location.hostname.toLowerCase().startsWith('www')){
  socket = io({path: "/leon/port-4101/socket.io"});  // e.g. '/leon/port-4100/socket.io' or '/socket.io'
}else{
  socket = io(); 
}

// let readyButton = document.querySelector("#ready");
let mainWrapper = document.querySelector(".main-wrapper")
let w = window.innerWidth;
let h = window.innerHeight;
let frogs = []

// socket communication

socket.emit("my-role", {role: "conductor"});

socket.on("all-frogs", function(data){
    console.log(data);
    for(let i = 0; i < data.length; i++){
        let frog = data[i];
        addFrog(frog.id, frog.frogIdx )
    }
    
})

socket.on("new-frog", function(frog){
    console.log(frog);
    addFrog(frog.id, frog.frogIdx )
})

socket.on('delete-frog', function(data){
    // delete the frog from the page
    // ..
    console.log(data);
    let elm = document.querySelector("#A"+data);
    if(elm){
        elm.remove();
    }
    
})



// addFrog("sdfobjweq", 0); // function test

function addFrog(socketID, frogIdx){
    let imgWrapper = document.createElement("div");
    imgWrapper.className = "img-wrap"
    imgWrapper.id = "A"+socketID;
    imgWrapper.style.opacity = 0.3;
    imgElm = document.createElement("img");
    imgElm.src = "../imgs/frog"+frogIdx+".png";
    imgWrapper.append(imgElm)
    mainWrapper.append(imgWrapper);


    // button socket communication:
    imgElm.addEventListener("click", function(){
        if(document.querySelector("#A"+socketID).style.opacity == 0.3){
            document.querySelector("#A"+socketID).style.opacity = 1;
        }else{
            document.querySelector("#A"+socketID).style.opacity = 0.3;
        }

        // document.querySelector("#A"+socketID).style.opacity = 0.3;
        // setTimeout(function(){
        //     document.querySelector("#A"+socketID).style.opacity = 1;
        // }, 500)
        socket.emit("trigger-frog", socketID)

    })
}
