const toggleBtn = document.querySelector("#toggleBtn");
const recordBtn = document.querySelector("#recordBtn");
const video = document.querySelector("video");

let stream = null;
let recorder = null;
let timeout = null;

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 720, height: 480 },
    audio: true,
  });

  video.srcObject = stream;
  video.play();

  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (event) => {
    video.srcObject = null;
    video.src = URL.createObjectURL(event.data);
    video.play();
    video.loop = true;
  };
};

const handleToggle = () => {
  video.classList.toggle("hidden");
  if (!video.classList.contains("hidden")) {
    init();
  } else {
    video.srcObject = null;
  }
};

const handleStart = () => {
  recorder.start();
  timeout = setTimeout(() => recorder.stop(), 10000);
  recordBtn.textContent = "정지";
  recordBtn.removeEventListener("click", handleStart);
  recordBtn.addEventListener("click", handleStop);
};

const handleStop = () => {
  clearTimeout(timeout);
  recorder.stop();
  recordBtn.textContent = "다운로드";
  recordBtn.removeEventListener("click", handleStop);
  recordBtn.addEventListener("click", handleDownload);
};

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = video.src;
  a.download = "short.webm";
  a.click();
};

toggleBtn.addEventListener("click", handleToggle);
recordBtn.addEventListener("click", handleStart);
