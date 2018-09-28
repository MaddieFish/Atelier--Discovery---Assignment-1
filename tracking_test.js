//Reference: BMOREN (Get started with color tracking)-https://gist.github.com/bmoren/3ff2cbc1f254092b82f12ab039fa5da2
//Refernce: Colour Camera-https://trackingjs.com/examples/color_camera.html

var colors;
var capture;
var trackingData;

function setup(){
	createCanvas(windowWidth, windowHeight);
	capture = createCapture(VIDEO); //capture webcam
	capture.position(0,0);
	capture.style('opacity', 0);
	capture.size(windowWidth, windowHeight);
	capture.id("myVideo"); //gives an ID similar to the one in tracker.js)
	//capture hide

	colors = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);
	// colors = new tracking.ColorTracker('magenta');


 	tracking.track('#myVideo', colors); // start the tracking of the colors above on the camera in p5
}

function draw(){
	background(255, 50);

	colorVision();

}

function colorVision(){
	 //start detecting the tracking
  	colors.on('track', function(event) { //this happens each time the tracking happens
    trackingData = event.data // break the trackingjs data into a global so we can access it with p5
  });

	console.log(trackingData);
    if(trackingData){ //if there is tracking data to look at, then...
   		for (var i = 0; i < trackingData.length; i++) { //loop through each of the detected colors

    	console.log(colors[0]);

    	noFill();

    	if(color('magenta')) {
    		stroke('magenta');
    	} else if(color('cyan')) {
    		stroke('cyan');
    	} else if(color('yellow')) {
    		stroke('yellow');
		}

		// stroke(color);

    	ellipse(trackingData[i].x,trackingData[i].y,trackingData[i].width,trackingData[i].height)
    	}
 	}

}