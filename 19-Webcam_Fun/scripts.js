const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio:false }) //return a promise
    .then(localMediaStream => {
      console.log(localMediaStream);
      // set video's src and convert it to objectURL
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })  
    // in html src of the video is "blob:http://..."
    //<video class="player" src="blob:http://localhost:3000/cedaf22f-9eec-49e1-bb43-9ea515fe777e"></video>
    .catch(err => { // when access to the camera is denied
      console.log(`OH NOOOOO!`, err);
    })
}
// take video and put it to the canvas
function painToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {  // return so we can clearInterval when we want to
    ctx.drawImage(video, 0, 0, width, height);

  // TAKE the pixels out
    let pixels = ctx.getImageData(0, 0, width, height); // array of pixels, every pixel has data for red, green, blue and alpha

  // MESS with them
    // pixels = redEffect(pixels);

    pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.8;  // transparency

    // pixels = greenScreen(pixels);

  // PUT them BACK 
    ctx.putImageData(pixels, 0, 0);
  }, 16)  // update every 16 miliseconds
}

function takePhoto() {
  // played the sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');  // photo in text based form
  // create a link
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'photoName')
  link.innerHTML = `<img src="${data}" alt="Photo from camera"/>`;
  strip.insertBefore(link, strip.firstChild);
  console.log(data);
}


function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) { // incrementing by 4
    pixels.data[i + 0] = pixels.data[i + 0] + 180; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) { // reb,green and blue in different places
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};  // will hold min and max green

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out! because the 4th idex is the alpha(transparency pixel)
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}


getVideo();

// once video is played (getVideo()) it's going to then on 'canplay' paintToCanvas will run 
video.addEventListener('canplay', painToCanvas);