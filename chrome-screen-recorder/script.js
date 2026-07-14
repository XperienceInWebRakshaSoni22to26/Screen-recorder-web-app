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

        // Capture Screen
        screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });


        // Capture Microphone
        microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });


        // Combine Screen + Audio
        combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...microphoneStream.getAudioTracks()
        ]);


        // If user stops sharing from Chrome toolbar
        screenStream.getVideoTracks()[0].onended = () => {

            if (mediaRecorder && mediaRecorder.state !== "inactive") {
                stopRecording();
            }

        };


        // Live Preview
        previewVideo.srcObject = combinedStream;
        previewVideo.play();


        // Create Recorder
        mediaRecorder = new MediaRecorder(combinedStream);


        recordedChunks = [];


        // Store recording chunks
        mediaRecorder.ondataavailable = (event) => {

            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }

        };


        // Debug events
        mediaRecorder.onpause = () => {
            console.log("Recording Paused");
        };


        mediaRecorder.onresume = () => {
            console.log("Recording Resumed");
        };


        // After Stop
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

            pauseBtn.disabled = true;

            resumeBtn.disabled = true;

            stopBtn.disabled = true;

            downloadBtn.disabled = false;


        };


        // Start Recording
        mediaRecorder.start(1000);


        console.log(
            "Recorder State:",
            mediaRecorder.state
        );


        // Button states

        startBtn.disabled = true;

        pauseBtn.disabled = false;

        resumeBtn.disabled = true;

        stopBtn.disabled = false;

        downloadBtn.disabled = true;



    }
    catch(error){

        console.error(error);

        alert(
            "Permission denied or cancelled."
        );

    }

}




function pauseRecording(){

    console.log(
        "Before Pause:",
        mediaRecorder.state
    );


    if(
        mediaRecorder &&
        mediaRecorder.state === "recording"
    ){

        mediaRecorder.pause();


        pauseBtn.disabled = true;

        resumeBtn.disabled = false;

    }

}




function resumeRecording(){

    console.log(
        "Before Resume:",
        mediaRecorder.state
    );


    if(
        mediaRecorder &&
        mediaRecorder.state === "paused"
    ){

        mediaRecorder.resume();


        pauseBtn.disabled = false;

        resumeBtn.disabled = true;

    }

}





function stopRecording(){


    if(
        mediaRecorder &&
        mediaRecorder.state !== "inactive"
    ){

        mediaRecorder.stop();

    }



    if(combinedStream){

        combinedStream
        .getTracks()
        .forEach(track => {
            track.stop();
        });

    }


}





function downloadRecording(){


    if(!recordedBlob){

        alert(
            "No recording available!"
        );

        return;

    }


    const downloadURL =
        URL.createObjectURL(recordedBlob);



    const a =
        document.createElement("a");



    a.href = downloadURL;


    a.download =
        "screen-recording.webm";



    document.body.appendChild(a);


    a.click();



    document.body.removeChild(a);



    URL.revokeObjectURL(downloadURL);


}