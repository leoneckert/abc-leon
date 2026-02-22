
let socket;
if(location.hostname.toLowerCase().startsWith('browsercircus') || location.hostname.toLowerCase().startsWith('www')){
  socket = io({path: "/leon/port-4101/socket.io"});  // e.g. '/leon/port-4100/socket.io' or '/socket.io'
}else{
  socket = io(); 
}

let readyButton = document.querySelector("#ready");
let mainWrapper = document.querySelector(".main-wrapper")
let w = window.innerWidth;
let h = window.innerHeight;
let audioElm, imgElm;
let frogIdx;
let frogSize = 0;

readyButton.addEventListener("click", function(){
    mainWrapper.append(imgElm);
    readyButton.remove();

    // connect to socket server
    socket = io({ path: base + '/socket.io' });  

    
    // socket communication
    let data = {
        role: "frog",
        frogIdx: frogIdx
    }
    socket.emit("my-role", data);

    socket.on("make-sound", function(){
        audioElm.play()
    })
    socket.on("sound-on", function(){
        audioElm.loop = true;
        audioElm.play();
        imgElm.style.filter = "none";
        document.querySelector('.main-wrapper').style.backgroundColor = "#8bbfff";
        
    })
    socket.on("sound-off", function(){
        audioElm.pause()
        audioElm.currentTime = 0;
        imgElm.width = frogSize;
        imgElm.height = frogSize;
        imgElm.style.filter = "grayscale(100%)";
        document.querySelector('.main-wrapper').style.backgroundColor = "black";
    })

   
    // TESTING IF JS CAN PLAY THE AUDIO:
    setTimeout(function(){
        audioElm.play()
    }, 100)
})

window.addEventListener("load", function(){
    console.log("ready");
    
    frogIdx = Math.floor(Math.random()*9);
    
    console.log(frogIdx);

    audioElm = document.createElement("audio");
    audioElm.controls = true;
    audioElm.id = "frogSound";
    // audioElm.innerHTML = `
    //     <source src="sounds/f`+frogIdx+`.mp3" type="audio/mpeg">
    //     Your browser does not support the audio element.
    // `
    audioElm.innerHTML = `
        <source src="sounds/d`+frogIdx+`.wav" type="audio/mpeg">
        Your browser does not support the audio element.
    `

    imgElm = document.createElement("img");
    imgElm.src = "../imgs/frog"+frogIdx+".png";
    imgElm.id = "frogImg";
    imgElm.style.filter = "grayscale(100%)";

    
    if(w > h){
        frogSize = Math.min(h, 400);

    }else{
        frogSize = Math.min(w, 400);
    }
    imgElm.width = frogSize;
    imgElm.height = frogSize;

    imgElm.addEventListener("click", function(){
        audioElm.play();
    })

    audioElm.addEventListener("timeupdate", function(){
        console.log(imgElm.width)
        imgElm.width = imgElm.width+2;
        imgElm.height = imgElm.height+2;
    })
    audioElm.addEventListener("ended", function(){
        imgElm.width = frogSize;
        imgElm.height = frogSize;
    })

})


