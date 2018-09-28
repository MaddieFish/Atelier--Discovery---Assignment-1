//Reference: BMOREN (Get started with color tracking)-https://gist.github.com/bmoren/3ff2cbc1f254092b82f12ab039fa5da2
//Refernce: Colour Camera-https://trackingjs.com/examples/color_camera.html

var colors;
var capture;
var trackingData;
var mic;
var analyzer;
var fft;
var osc;
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

 	// mic = new p5.AudioIn();
 	// mic.start();

 	// analyzer = new p5.Amplitude();
 	// analyzer.setInput(mic);
 	// ftt.setInput(mic);
 	
 	osc = new p5.TriOsc();
 	osc.amp(0);
 	osc.start();

 	fft = new p5.FFT();
 	fft.setInput(osc);

}

function draw(){
	background(50, 50);
	// image(capture, 0, 0, windowWidth, windowHeight);
	colorVision();

	// var spectrum = fft.analyze();

 //    beginShape();
	//    for (i = 0; i<spectrum.length; i++) {
	//    vertex(i+100, map(spectrum[i], 0, 255, 0, windowHeight) );
 //    }
 //    endShape();
}

function colorVision(){
    // var rms = analyzer.getLevel();
    // var r = map(rms, 0, 1, 0, 200);

	 //detects the tracking
  	colors.on('track', function(event) { 
    trackingData = event.data 
  });

	console.log(trackingData);
    
    if(trackingData){ //if a colour is detected
   		for (var i = 0; i < trackingData.length; i++) { //loop through each of the detected colors

    	console.log(trackingData[i].color);

    	// noFill();
    	fill(trackingData[i].color);
    	//changes the colour of the shape created to match the tracked colour
 		stroke(trackingData[i].color);
    	ellipse(trackingData[i].x, trackingData[i].y, trackingData[i].width);

    	 if (trackingData[i].color !== ['magenta', 'cyan', 'yellow']) {
		    if (!playing) {
		      // ramp amplitude to 0.5 over 0.05 seconds
		      	 if(trackingData[i].color === 'cyan'){
					 var amp = map(trackingData[i].height, 0, 1, 10, .01);
					 osc.amp(amp, 0.5);

				 if(trackingData[i].color === 'yellow'){
				 	 var freq = map(trackingData[i].width, 0, windowWidth, 40, 880);
					 osc.freq(freq);
				 }
			 }
		      // osc.amp(0.5, 0.05);
		      playing = true;
		    } else {
		      // ramp amplitude to 0 over 0.5 seconds
		      osc.amp(0, 0.5);
		      playing = false;
		    }
		  }
    	}

    	stroke(255);
    	// noFill();
		for (var i = 1; i < trackingData.length; i++){

		line(trackingData[i-1].x, trackingData[i-1].y, trackingData[i].x, trackingData[i].y);
		}
		
 	}
 }
