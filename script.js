// script.js
const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');

const submit = document.querySelector("[type='submit']");
const submit_text_top = document.getElementById('text-top').value;
const submit_text_bottom = document.getElementById('text-bottom').value;

const clear = document.querySelector("[type='reset']");

var synth = window.speechSynthesis;
var read_text = document.querySelector("[type='button']");
var voiceSelect = document.querySelector('select');
var voices = [];
// var volume_level = 3;

const range = document.querySelector("#volume-group > input[type='range']");
const icon = document.querySelector("#volume-group > img");

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // clear canvas context
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // fill the canvas with black 
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // new canvas with image dimension
  let ctx_new = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, ctx_new.startX, ctx_new.startY, ctx_new.width, ctx_new.height);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

// 2. input_image
var input_image = document.getElementById('image-input');

input_image.addEventListener("change", () => {
  img.src = URL.createObjectURL(input_image.files[0]);
  img.alt = input_image.files[0].name;
  canvas.alt = input_image.files[0].name;
})

// 3. submit -- for generate button
submit.addEventListener("click", function(event){
  new_canvas(document.getElementById('text-top').value, document.getElementById('text-bottom').value, document.getElementById("user-image").getContext("2d"));
  submit.disabled = true;
  clear.disabled = false;
  read_text.disabled = false;
  voiceSelect.disabled = false;
});

// modify the text content to fit properly in the meme. 
function new_canvas(top, bottom, ctx){
  ctx.fillStyle = "White";
  ctx.setAlign = "Center";
  ctx.font = "40pt Impact";
  ctx.textAlign = "center";
  ctx.fillText(top.toUpperCase(), canvas.width/2, 60);
  ctx.fillText(bottom.toUpperCase(), canvas.width/2, 385);
}

// 4. Clear
clear.addEventListener("click", function(){
  const canvas = document.getElementById('user-image');
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // reset the value of the inputs
  document.getElementById("image-input").value = null;
  document.getElementById("text-top").value = "";
  document.getElementById("text-bottom").value = "";

  //disabled unnecessary buttons
  submit.disabled = false;
  clear.disabled = true;
  read_text.disabled = true;
  voiceSelect.disabled = true;
});

// 5. Read Text
function populateVoiceList() {
  voiceSelect.disabled = false;

  // After grabbing the speechSynthesis, populate the list of voices
  speechSynthesis.addEventListener("voiceschanged", () => {
    var voices = speechSynthesis.getVoices()
  
    for(var i = 0; i < voices.length; i++) {
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

      if(voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      voiceSelect.appendChild(option);
    }
});
}

populateVoiceList();

// Read text button that grabs the top text and bottom text 
read_text.addEventListener("click", function(){
  let texttop = document.getElementById("text-top").value;
  let textbottom = document.getElementById("text-bottom").value;

  var utterance = new SpeechSynthesisUtterance(texttop+ " " + textbottom);
  utterance.volume = range.value/100;
  utterance.lang = voiceSelect.value.slice(-6, -1);
  synth.speak(utterance);
 
});

// 6.Volume-group(volume-slider)

setTimeout(() => {
  console.log(window.speechSynthesis.getVoices());
}, 50);


// Give the range of volume using different icons
range.addEventListener("input", function(){
  if (range.value >= 67){
    icon.src = "icons/volume-level-3.svg";
  }

  else if(range.value >= 34){
    icon.src = "icons/volume-level-2.svg";
  }

  else if(range.value >= 1){
    icon.src = "icons/volume-level-1.svg";
  }

  else if(range.value == 0){
    icon.src = "icons/volume-level-0.svg";
  }
});

// extra event listener
var shoot = document.querySelector("[type='reset']").addEventListener("click", function(){
  alert("Clear!")
})

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
