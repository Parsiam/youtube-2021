import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const toggleBtn = document.querySelector("#toggleBtn");
const recordContainer = document.querySelector("#recordContainer");
const recordBtn = document.querySelector("#recordBtn");
const video = document.querySelector("video");

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

let stream = null;
let recorder = null;
let videoFile = null;

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleToggle = () => {
  recordContainer.classList.toggle("hidden");
  if (!recordContainer.classList.contains("hidden")) {
    init();
  } else {
    video.srcObject = null;
  }
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 720, height: 480 },
    audio: true,
  });

  video.srcObject = stream;
  video.play();

  recorder = new MediaRecorder(stream, { MimeType: "video/webm" });

  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.play();
    video.loop = true;
    recordBtn.textContent = "다운로드";
    recordBtn.addEventListener("click", handleDownload);
  };
};

const handleStart = () => {
  recorder.start();
  recordBtn.textContent = "5초 후에 종료됩니다.";
  recordBtn.removeEventListener("click", handleStart);
  setTimeout(() => recorder.stop(), 5500);
};

const handleDownload = async () => {
  recordBtn.removeEventListener("click", handleDownload);
  recordBtn.textContent = "파일 변환 중";
  const ffmpeg = createFFmpeg();
  await ffmpeg.load();

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "shorts.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  recordBtn.textContent = "시작하기";
  video.srcObject = stream;
  video.play();
  recordBtn.addEventListener("click", handleStart);
};

toggleBtn.addEventListener("click", handleToggle);
recordBtn.addEventListener("click", handleStart);
