let cap;
let d;
let ls = -1;
let lineHeight = 500;
let word = '';

let input;
let videoInput;
let vid;

let cameraToggle = true;
let colourToggle = false;

function setup() {
    //canvas stuff ¬
    let myCanvas01DivWidth = select("#myCanvas01").width;
    let aspectRatio = 4 / 3;
    let widthFinder = int(myCanvas01DivWidth);
    let heightFinder = int(widthFinder / aspectRatio);
    let cnv = createCanvas(widthFinder, heightFinder); //640, 480  / 4:3
    cnv.parent("myCanvas01")
  
  d = pixelDensity();
  
  textAlign(CENTER); //FIXES KERNING OF 'I' AND SIMILAR
  
  cap = createCapture(VIDEO);
  cap.hide();
  
  input = createInput('ALPHABET [SOUP] / TYPE HERE... ');
  input.addClass('inputTextClass');
  input.parent('inputTextDiv');

  videoInput = createFileInput(handleFile);
  videoInput.addClass('videoInputButtonClass');
  videoInput.parent('videoInputButtonID');

  //
  
  fontTracking = select('#fontTracking');
  fontLineHeight = select('#lineHeight');
  fontSize = select('#fontSize');
  fontOpacity = select('#fontOpacity');
  colourSelect = select('#colourSelect');

  //
  
  cameraButton = select('#camera')
  cameraButton.mousePressed(cameraNow);
}

function draw() {
  background(0);
  
  let word = input.value();
  let newWord = split(word, '');


   if ((vid) && (vid.width < vid.height)){ //portrait video
    imageMode(CENTER);
    image(vid, width/2, height/2, vid.width*height/vid.height, height);

  } else if ((vid) && (vid.width > vid.height)){ //landscape video
    imageMode(CENTER);
    image(vid, width/2, height/2, width, vid.height*width/vid.width);

  } else if ((vid) && (vid.width === vid.height)){ //square video
    imageMode(CENTER); 
    image(vid, width/2, height/2, vid.width*height/vid.height, height);

  } else { //camera
    image(cap, 0, 0, width, height)
  }
  
  if (cameraToggle == true){
    vid = null;
    cameraToggle = false;
  }

  if (colourSelect.value() > 0){
    colourToggle = true;
  } else {
    colourToggle = false;
  }

  loadPixels();
  imageMode(CORNER);
  fill(0,0,0); //transparency for image + video upload
  rect(0,0,width*2,height*2);

  for (let cy = 0; cy < height; cy += fontLineHeight.value()) {
    for (let cx = 0; cx < width; cx += fontTracking.value()) {
        let xpos = (cx / width) * width;
        let ypos = (cy / height) * height;
        let offset = ((cy*d*width*d)+cx*d)*4;

        if (colourToggle == true){
          let vR = pixels[offset + 0];
          let vG = pixels[offset + 1];
          let vB = pixels[offset + 2];
          fill(vR, vG, vB, fontOpacity.value());
        } else {
          fill(255,fontOpacity.value())
        }
        
        textSize(fontSize.value()*(pixels[offset+1]/255));
        text(newWord[ls], xpos-240, ypos, lineHeight);
      
        if (ls >= -1){
          ls++;
        }
        if (ls >= newWord.length || cx === 0) {
          ls = 0;
        }
      }
    }
  }


function handleFile(file) {
  print(file);
  if (file.type === 'video') {
    vid = createVideo(file.data, playVid);
  } else {
    vid = null;
  }
}

function playVid(){
  vid.loop()
  vid.hide();
  vid.volume(0);
}

function cameraNow(){ //camera toggle
  cameraToggle = !cameraToggle;
} 