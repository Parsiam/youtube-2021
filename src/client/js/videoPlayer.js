const videoContainer = document.querySelector("#videoContainer");
const videoController = document.querySelector("#videoController");
const video = document.querySelector("video");
const playBtn = document.querySelector("#playBtn");
const muteBtn = document.querySelector("#muteBtn");
const volumeRange = document.querySelector("#volumeRange");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const timeRange = document.querySelector("#timeRange");
const fullBtn = document.querySelector("#fullBtn");

let mouseOnScreen = null;
let prevVolume = 0.5;
video.volume = volumeRange.value;

const handlePlay = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.classList = video.paused
    ? "fas fa-play fa-2x mr-10"
    : "fas fa-pause fa-2x mr-10";
};

const handleMute = () => {
  if (video.muted) {
    prevVolume = prevVolume === "0" ? "0.5" : prevVolume;
    video.volume = prevVolume;
    volumeRange.value = prevVolume;
    video.muted = false;
    muteBtn.classList = "fas fa-volume-up fa-2x mr-5";
  } else {
    video.volume = 0;
    volumeRange.value = 0;
    video.muted = true;
    muteBtn.classList = "fas fa-volume-mute fa-2x mr-5";
  }
};

const handleVolume = (event) => {
  const {
    target: { value },
  } = event;
  prevVolume = value;
  video.volume = prevVolume;
  video.volume === 0 ? (video.muted = true) : (video.muted = false);
  muteBtn.classList =
    video.volume === 0
      ? "fas fa-volume-mute fa-2x mr-5 "
      : "fas fa-volume-up fa-2x mr-5";
};

const handleMetadata = () => {
  const total = Math.floor(video.duration);
  totalTime.textContent = formatTime(total);
  timeRange.max = total;
};

const handleTimeRange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);

const handleTimeUpdate = () => {
  const current = Math.floor(video.currentTime);
  currentTime.textContent = formatTime(current);
  timeRange.value = current;
};

const handleScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
  fullBtn.classList = document.fullscreenElement
    ? "fas fa-expand fa-2x"
    : "fas fa-compress fa-2x";
};

const handleSpaceBar = (event) => {
  if (event.target.tagName === "INPUT") {
    return;
  }
  event.preventDefault();
  if (event.code === "Space") {
    handlePlay();
  } else if (event.code === "KeyF") {
    handleScreen();
  }
};

const addHidden = () => videoController.classList.add("hidden");
const removeHidden = () => videoController.classList.remove("hidden");

const handleEnter = () => {
  if (!video.paused) {
    removeHidden();
  }
};

const handleLeave = () => {
  if (!video.paused) {
    addHidden();
    mouseOnScreen = null;
  }
};

const handleMove = () => {
  if (mouseOnScreen) {
    clearTimeout(mouseOnScreen);
    handleEnter();
  }
  mouseOnScreen = setTimeout(handleLeave, 3000);
};

const handleView = () => {
  const { id } = video.dataset;
  return fetch(`/api/video/${id}/view`, {
    method: "POST",
  });
};

const setURL = () => {
  const { url } = video.dataset;
  video.src = "/" + url;
};

addEventListener("keypress", handleSpaceBar);
playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolume);
timeRange.addEventListener("input", handleTimeRange);
fullBtn.addEventListener("click", handleScreen);
videoContainer.addEventListener("mouseenter", handleEnter);
videoContainer.addEventListener("mouseleave", handleLeave);
videoContainer.addEventListener("mousemove", handleMove);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handlePlay);
video.addEventListener("ended", handleView);
video.addEventListener("pause", removeHidden);
video.addEventListener("play", handleMove);
video.addEventListener("loadedmetadata", handleMetadata);

addEventListener("DOMContentLoaded", setURL);
