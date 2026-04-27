const record = document.querySelector(".record");
const stop = document.querySelector(".stop");

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("getUserMedia supported.");
  navigator.mediaDevices
    .getUserMedia(
      // constraints - only audio needed for this app
      {
        audio: true,
      },
    )
    // Success callback
    .then(gotUserMedia)

    // Error callback
    .catch((err) => {
      console.error(`The following getUserMedia error occurred: ${err}`);
    });
} else {
  console.log("getUserMedia not supported on your browser!");
}



function gotUserMedia(stream){
    const mediaRecorder = new MediaRecorder(stream);


    record.addEventListener("click", function(){
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        record.style.background = "red";
        record.style.color = "black";
    })

    let chunks = [];

    mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
    };

    stop.onclick = () => {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        record.style.background = "";
        record.style.color = "";
    };

    mediaRecorder.onstop = (e) => {
        console.log("recorder stopped");

        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        let player = document.createElement("audio");
        player.controls = true;
        player.src = audioURL;
        document.body.append(player)
        sendSoundToServer(blob)

    };


}

function sendSoundToServer(blob) {
    console.log(blob)
    fetch('upload-sound', {
        method: 'POST',
        headers: { 'Content-Type': 'audio/mpeg' }, // or jpg
        body: blob
    })
    .then(data => {
        console.log(data.status)
        // resetCamera();
    });
}