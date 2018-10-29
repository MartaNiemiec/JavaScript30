// ---- Get elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');  // anything that has data-skip attribute
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('.fullscreen');


//---- Build out functions
// play/pause toggle
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  // if (video.paused)  { // there isn't video.playing property
  //   video.play();
  // } else { 
  //   video.pause();
  // }
  video[method]();  // video['play']() = video.play() Property accessors provide access to an object's properties by using the dot notation or the bracket notation. 
  // "object.property" or "object['property']"
}

// play/pause button toggle
function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  console.log(icon);
  toggle.textContent = icon;
}

// skip buttons
function skip() {
  console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip); // parseFloat-change string to a number
}

// playbackRate/playbackRate range 
function handleRangeUpdate() {
  console.log(this.value);
  video[this.name] = this.value;
}

// changing progress bar (flex-basis: %;) by timeupdate event listener
function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

// changing progress bar on clicking on it 
function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

// fullscreen
function screenSize() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) {  /* Chrome, Safari and Opera */
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) { /* IE/Edge */
    video.msRequestFullscreen();
  } else if (video.mozRequestFullscreen) {  /* Firefox */
    video.mozRequestFullscreen();
  }
}

/* Close fullscreen */
// function closeFullscreen() {
//   if (document.exitFullscreen) {
//     document.exitFullscreen();
//   } else if (document.mozCancelFullScreen) { /* Firefox */
//     document.mozCancelFullScreen();
//   } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
//     document.webkitExitFullscreen();
//   } else if (document.msExitFullscreen) { /* IE/Edge */
//     document.msExitFullscreen();
//   }
// }


// ----Hook up the event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));  

let mousedown = false; // flag variable = 
progress.addEventListener('click', scrub);

// progress.addEventListener('mousemove', () => {
//   if (mousedown) {
//     scrub();
//   }
// });
progress.addEventListener('mousemove', (e) => mousedown && scrub(e))  // when mousedown=true then move to a scrub(e) but when is false it's not going to run a scrub(e); a scrub function requires event when it's happend on mousemove it's need to pass it to an arrow function

progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mousemove', () => mousedown = false);

fullscreen.addEventListener('click', screenSize);
 