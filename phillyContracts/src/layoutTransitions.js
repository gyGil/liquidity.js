var TWEEN = require('tween.js');
var layoutStates = require('./layoutStates');
var movieLayoutOrder = require('./movieLayoutOrder');
var mix = require('./neilviz/util/mix');

var transitions = null;

module.exports = function(params) {
    if (transitions !== null) return transitions;

    var textObjects = params.textObjects;
    var showCircles = params.showCircles;
    var nodes = params.nodes;
    var circleGeo = params.circleGeo;
    var camera = params.camera;
    var clock = params.clock;
    var force = params.force;


    var currentState = 0;
    var transTween;
    var textTweens = [];


    var textKeys = Object.keys(textObjects);


    var stateIds = Object.keys(layoutStates);
    var curStateNum = 0;


    var maybeHide = function(item) {
        //used for tween on opacity
        return function() {
            item.material.uniforms.opacity.value = this.v;
            item.visible = (this.v > 0);
        };
    };


    var transState = {
      t: 0
    };

    function layoutUpdate() {
        //TODO: add sort order to state
        var ts = this;
        var colorT = Math.max(0, ts.t * 2 - 1);

        nodes.forEach(function(node, i) {
            var pNode = layoutStates[ts.prev].nodes[i];
            var nNode = layoutStates[ts.next].nodes[i];


            node.foci = (i / nodes.length > ts.t) ? pNode.foci : nNode.foci;
            node.color.r = mix(pNode.color[0], nNode.color[0], colorT);
            node.color.g = mix(pNode.color[1], nNode.color[1], colorT);
            node.color.b = mix(pNode.color[2], nNode.color[2], colorT);
            if (showCircles)
                circleGeo.setSingleColor(i, node.color);
        });

        var pText = (layoutStates[ts.prev] || layoutStates.empty).text;
        var nText = (layoutStates[ts.next] || layoutStates.empty).text;



        textKeys.forEach(function(key) {
            var item = textObjects[key];
            var nOpacity = (nText.indexOf(key) >= 0) ? 1 : -1;
            var pOpacity = (pText.indexOf(key) >= 0) ? 1 : -1;
            var opacity = Math.max(0,mix(pOpacity,nOpacity,ts.t)) * item.opFactor;
            item.material.uniforms.opacity.value = opacity;
            item.visible = opacity > 0;




        });

    }

    function layoutUpdateWithCamera() {
        //TODO: add sort order to state
        var ts = this;
        var colorT = Math.max(0, ts.t * 2 - 1);
        var pCam = layoutStates[ts.prev].camPos;
        var nCam = layoutStates[ts.next].camPos;
        var camEase = TWEEN.Easing.Quadratic.InOut(ts.t);
        camera.position.set(
            mix(pCam.x, nCam.x, camEase),
            mix(pCam.y, nCam.y, camEase),
            mix(pCam.z, nCam.z, camEase)
        );

        nodes.forEach(function(node, i) {
            var pNode = layoutStates[ts.prev].nodes[i];
            var nNode = layoutStates[ts.next].nodes[i];


            node.foci = (i / nodes.length > ts.t) ? pNode.foci : nNode.foci;
            node.color.r = mix(pNode.color[0], nNode.color[0], colorT);
            node.color.g = mix(pNode.color[1], nNode.color[1], colorT);
            node.color.b = mix(pNode.color[2], nNode.color[2], colorT);
            if (showCircles)
                circleGeo.setSingleColor(i, node.color);
        });
    }


    function gotoState(sid) {
      //go imidiately to layout state, using state id (string)
        currentState = sid;
        transState.prev = currentState; //previous state
        transState.next = currentState; // next state
        transState.t = 1;
        layoutUpdateWithCamera.call(transState);
        textKeys.forEach(function(key) {
            var item = textObjects[key];
            var opacity = (layoutStates[sid].text.indexOf(key) >= 0) ? 1 : 0;
            item.material.uniforms.opacity.value = opacity;
            item.visible = (opacity > 0);
        });

    }


    function gotoMovieState(seqId) {
      var p = Math.floor(seqId);
      var n = Math.ceil(seqId);
      if (transState.next !== movieLayoutOrder[n]) force.start();
      transState.prev = movieLayoutOrder[p];
      transState.next = movieLayoutOrder[n];
      transState.t = seqId - p;
      layoutUpdate.call(transState);

    }



    function animateToState(next, prev, startTime) {
    //this is only used in interactive mode

        //TODO: be more selective
        //TWEEN.removeAll();
        //transitioning from stated state, or current state
        var sState = (prev === undefined) ? transState : {};

        if (startTime === undefined) startTime = clock.getElapsedTime() * 1000;
        if (prev === undefined) prev = currentState;
        currentState = next;

        sState.t = 0;
        sState.prev = prev;
        sState.next = next;


        transTween = new TWEEN.Tween(sState)
            .onUpdate(layoutUpdateWithCamera)
            .to({t: 1}, 1200)
            .onStart(force.start)
            .start(startTime);

        var pText = (layoutStates[prev] || layoutStates.empty).text;
        var nText = (layoutStates[next] || layoutStates.empty).text;



        textKeys.forEach(function(key) {
            var item = textObjects[key];
            var nOpacity = item.opFactor * (nText.indexOf(key) >= 0) ? 1 : 0;
            var pOpacity = item.opFactor * (pText.indexOf(key) >= 0) ? 1 : 0;

            if (pOpacity && !nOpacity)
                textTweens.push(new TWEEN.Tween({
                    v: pOpacity
                }).to({
                    v: nOpacity
                }, 200).onUpdate(maybeHide(item)).start(startTime));
            if (!pOpacity && nOpacity)
                textTweens.push(new TWEEN.Tween({
                    v: pOpacity
                }).to({
                    v: nOpacity
                }, 500).delay(1100).onUpdate(maybeHide(item)).start(startTime));

        });


    }


    function nextState() {
        curStateNum = (curStateNum + 1) % stateIds.length;
        animateToState(stateIds[curStateNum]);

    }
    transitions = {
      gotoState: gotoState,
      nextState: nextState,
      animateToState: animateToState,
      gotoMovieState: gotoMovieState,
      forceStart: force.start
    };
    return transitions;

};
