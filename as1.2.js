var colors;
var capture;
var trackingData;
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

 	analyzer = new p5.Amplitude();
 	analyzer.setInput(mic);
 	// fft = new p5.FFT();
 	// fft.setInput(mic);
 	osc = new p5.TriOsc();
 	osc.setType('sin');
 	osc.amp(0.5);

 	osc.start();
 	filter = new p5.BandPass();
 	noise = new p5.Noise();
 	noise.disconnect();
 	noise.connect(filter);
  	noise.start();

 	fft = new p5.FFT();

}

function draw(){
	// background(50);
	image(capture, 0, 0, windowWidth, windowHeight);
	colorVision();

	var spectrum = fft.analyze();

	stroke(255);
    beginShape();
	   for (m = 0; m<spectrum.length; m++) {
	   vertex(m+width/6, map(spectrum[m], 0, 255, windowHeight, 0) );
    }
    endShape();
}

function colorVision(){
    var rms = analyzer.getLevel();
    var r = map(rms, 0, 1, 0, 400);

	 //detects the tracking
  	colors.on('track', function(event) { 
    trackingData = event.data 
  });

	console.log(trackingData);
    
    if(trackingData){ //if a colour is detected
   		for (var i = 0; i < trackingData.length; i++) { //loop through each of the detected colors

    	if(trackingData[i].height >= 20){
	 		if (!playing) {	 
	 			 if(trackingData[i].color === 'cyan'){

	 			 var freq = map(trackingData[i].width, 0, windowWidth, 40, 880);
				 osc.freq(freq);
				 console.log(playing);
				 }

				 if (trackingData[i].color === "yellow"){
	 			 var amp = map(trackingData[i].height, 0, 1, windowHeight, .5);
			 
		 			// if(trackingData[i].color === 'magenta'){
		 				var seconds = map(trackingData[i].width, 0, windowWidth, 0, 2);
		 				osc.amp(amp, seconds);
		 				console.log(seconds);
		 			// }else{
		 			//  	osc.amp(amp);
		 			// }
				 }

				 if (trackingData[i].color === "magenta"){
				 	 // set the BandPass frequency based on mouseX
					  var freq = map(trackingData[i].height, 0, windowHeight, 20, 10000);
					  filter.freq(freq);
					  // give the filter a narrow band (lower res = wider bandpass)
					  
					  var res = map(trackingData[i].x, 0, windowWidth, 0, 100);
					  filter.res(res);
				 }
		      // osc.amp(0.5, 0.05);
		      playing = true;
		    } else {
		      // ramp amplitude to 0 over 0.5 seconds
		      osc.amp(0, 1);
		      playing = false;
		      console.log(playing);
		    }	 

	    	}

    	console.log(trackingData[i].color);

    	// noFill();
    	fill(trackingData[i].color);

    	//changes the colour of the shape created to match the tracked colour
 		stroke(trackingData[i].color);
    	ellipse(trackingData[i].x, trackingData[i].y, trackingData[i].width + r)

	    	
    	}

    	stroke(255);
    	noFill();

    	

		for (var i = 1; i < trackingData.length; i++){

		line(trackingData[i-1].x, trackingData[i-1].y, trackingData[i].x, trackingData[i].y);
		}
		
 	}
 }
