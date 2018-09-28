//Reference: BMOREN (Get started with color tracking)-https://gist.github.com/bmoren/3ff2cbc1f254092b82f12ab039fa5da2
//Reference: Colour Camera-https://trackingjs.com/examples/color_camera.html

var capture;

//Tracking variables
var colors;
var trackingData;

//Audio variables
var mic;
var analyzer;
var fft;
var osc;
var noise;
var filter;
var playing = false;

function setup(){
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO); //capture webcam
  capture.position(0,0);
  capture.style('opacity', 0);
  capture.size(windowWidth, windowHeight);
  capture.id("myVideo"); //gives an ID similar to the one in tracker.js)

  colors = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);
  tracking.track('#myVideo', colors); // start the tracking of the colors above on the camera in p5
  // background(0);

  mic = new p5.AudioIn();
  mic.start();

  //Analyzes the sound from the mic which controls a pulsating effect on the ellipse shape of the tracked coloured object
  analyzer = new p5.Amplitude();
  analyzer.setInput(mic);
 
  osc = new p5.TriOsc();
  osc.setType('sin');
  osc.amp(0.5);
  osc.start();

  //Tracking objects that are magenta across the screen controls the filter
  filter = new p5.BandPass();
  noise = new p5.Noise();
  noise.disconnect();
  noise.connect(filter);
  noise.start();

  fft = new p5.FFT();

}

function draw(){
  //Create fading out object trails using the alpha variable
  background(50, 50);
  // image(capture, 0, 0, windowWidth, windowHeight);
  colorVision();


  //Creates a spectrum to visualize the change in the osc
  var spectrum = fft.analyze();
  noFill();
  stroke(255);
    beginShape();
     for (m = 0; m<spectrum.length; m++) {
     vertex(m+width/6, map(spectrum[m], 0, 255, windowHeight, 0) );
    }
    endShape();
}

function colorVision(){
    //mic analyzation variables
    var rms = analyzer.getLevel();
    var r = map(rms, 0, 1, 0, 400);

   //detects the tracking
    colors.on('track', function(event) { 
    trackingData = event.data 
    });

  console.log(trackingData);
    
    if(trackingData){ //If a colour is detected
      for (var i = 0; i < trackingData.length; i++) { //The tracked colours will be looped through

      if(trackingData[i].height >= 20){ //If there is no tracked colour that exeeds 20 pixels, no sound will be triggered
      if (!playing) { 
         if(trackingData[i].color === 'cyan'){
         //The frequency of the osc is controled by the size of the tracked cyan object
         // var freq = map(trackingData[i].width, 0, windowWidth, 40, 880);
        
         //The frequency of the osc is controled by the x-coordinates of the tracked cyan object
         var freq = map(trackingData[i].x, 0, windowWidth, 40, 880);

         osc.freq(freq);
         console.log(playing);
         }

         if (trackingData[i].color === "yellow"){
         //the amplitude (volume) of the osc is controled by the size of the tracked yellow object
         // var amp = map(trackingData[i].height, 0, 1, windowHeight, 0.5);
          
         //the amplitude (volume) of the osc is controled by the y-coordinates of the tracked yellow object
         var amp = map(trackingData[i].y, 0, windowHeight, windowHeight, 0.5);

         var seconds = map(trackingData[i].width, 0, windowWidth, 0, 2);
         osc.amp(amp, seconds);
         console.log(seconds);
         }

         if (trackingData[i].color === "magenta"){
            //Set the BandPass frequency based on the size of the magenta object
            var freq = map(trackingData[i].height, 0, windowHeight, 20, 10000);
            filter.freq(freq);
           
            //Gives the filter a narrow band depending on the x coordinates of the tracked magenta object 
            //Lower res = wider bandpass
            var res = map(trackingData[i].x, 0, windowWidth, 0, 100);
            filter.res(res);
         }
          // osc.amp(0.5, 0.05);
          playing = true;
        } else {
          // ramp amplitude to 0 over 1 second
          osc.amp(0, 1);
          playing = false;
          console.log(playing);
        }  
      }

      console.log(trackingData[i].color);

      // noFill();
      fill(trackingData[i].color);

      //Changes the colour of the shape created to match the tracked colour
      stroke(trackingData[i].color);
      //The mic will pick up the sounds of the oscillater and analyzes its amp to create a pulsating effect on the ellipse
      ellipse(trackingData[i].x, trackingData[i].y, trackingData[i].width + r)        
      }

    //Creates a white line between each ellipse of tracked colour 
    stroke(255);
    for (var i = 1; i < trackingData.length; i++){
    line(trackingData[i-1].x, trackingData[i-1].y, trackingData[i].x, trackingData[i].y);
    }
    
  }
 }
