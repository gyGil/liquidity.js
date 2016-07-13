/* Project configuration */

var config = {
  dotRadius: 10,
  dotValue: 5000000,
  //dotValue: 1000000,
  showCircles:false,
  showMetaBalls:true,
  showShadows:false,
  metaballResolution: 100, //450,
  movie: true,
  capture: false, // setting capture to true sets movie to true below
  captureWidth: 1280,
  captureHeight: 720,
  captureFPS: 30,
  captureDuration:10, // seconds
  lightIFactor: 1.4

};

if (config.capture) config.movie = true;

module.exports = config;
