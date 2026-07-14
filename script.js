const startBtn = document.getElementById("startBtn");

const pauseBtn = document.getElementById("pauseBtn");

const resumeBtn = document.getElementById("resumeBtn");

const stopBtn = document.getElementById("stopBtn");

const downloadBtn = document.getElementById("downloadBtn");

const previewVideo = document.getElementById("previewVideo");
let screenStream;
startBtn.addEventListener("click", startScreenCapture);

async function startScreenCapture() {

    try {

        screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });

        previewVideo.srcObject = screenStream;

        previewVideo.play();

    }

    catch (error) {

        console.error(error);

        alert("Screen sharing was cancelled.");

    }

}
previewVideo.srcObject = screenStream;
previewVideo.play();

console.log("UI Ready");