const startBtn = document.getElementById("startBtn");

const pauseBtn = document.getElementById("pauseBtn");

const resumeBtn = document.getElementById("resumeBtn");

const stopBtn = document.getElementById("stopBtn");

const downloadBtn = document.getElementById("downloadBtn");

const previewVideo = document.getElementById("previewVideo");
let screenStream;

let microphoneStream;
let combinedStream;
startBtn.addEventListener("click", startScreenCapture);

async function startScreenCapture() {

    try {

        screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });

        microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });
        combinedStream = new MediaStream([
    ...screenStream.getVideoTracks(),
    ...microphoneStream.getAudioTracks()
]);

        previewVideo.srcObject = combinedStream;

        previewVideo.play();

    } catch (error) {

        console.error(error);

        alert("Permission denied or cancelled.");

    }

}
previewVideo.srcObject = screenStream;
previewVideo.play();

console.log("UI Ready");