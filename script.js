const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");
const downloadBtn = document.getElementById("downloadBtn");
const previewVideo = document.getElementById("previewVideo");

let screenStream;
let microphoneStream;
let combinedStream;
let mediaRecorder;
let recordedChunks = [];
let recordedBlob = null;

// Event Listeners
startBtn.addEventListener("click", startScreenCapture);
stopBtn.addEventListener("click", stopRecording);
downloadBtn.addEventListener("click", downloadRecording);
pauseBtn.addEventListener("click", pauseRecording);
resumeBtn.addEventListener("click", resumeRecording);

async function startScreenCapture() {
    try {
        // Get screen
        screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });

        // Get microphone
        microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        // Combine video + audio
        combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...microphoneStream.getAudioTracks()
        ]);

        // Show live preview
        previewVideo.srcObject = combinedStream;
        previewVideo.play();

        // Create recorder
        mediaRecorder = new MediaRecorder(combinedStream);

        recordedChunks = [];

        // Save chunks
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        // When recording stops
        mediaRecorder.onstop = () => {

            recordedBlob = new Blob(recordedChunks, {
                type: "video/webm"
            });

            const videoURL = URL.createObjectURL(recordedBlob);

            previewVideo.srcObject = null;
            previewVideo.src = videoURL;
            previewVideo.controls = true;
            previewVideo.play();

            startBtn.disabled = false;
            stopBtn.disabled = true;
            pauseBtn.disabled = true;
            resumeBtn.disabled = true;
            downloadBtn.disabled = false;
        };

        // Start recording
        mediaRecorder.start();

        // Button states
        startBtn.disabled = true;
        stopBtn.disabled = false;
        pauseBtn.disabled = false;
        resumeBtn.disabled = true;
        downloadBtn.disabled = true;

    } catch (error) {
        console.error(error);
        alert("Permission denied or cancelled.");
    }
}

function stopRecording() {

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    }

    if (combinedStream) {
        combinedStream.getTracks().forEach(track => track.stop());
    }
}
function downloadRecording() {

    if (!recordedBlob) {
        alert("No recording available!");
        return;
    }

    const downloadURL = URL.createObjectURL(recordedBlob);

    const a = document.createElement("a");

    a.href = downloadURL;

    a.download = "screen-recording.webm";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(downloadURL);

}
function pauseRecording() {

    if (mediaRecorder && mediaRecorder.state === "recording") {

        mediaRecorder.pause();

        pauseBtn.disabled = true;
        resumeBtn.disabled = false;

    }

}
function resumeRecording() {

    if (mediaRecorder && mediaRecorder.state === "paused") {

        mediaRecorder.resume();

        pauseBtn.disabled = false;
        resumeBtn.disabled = true;

    }

}