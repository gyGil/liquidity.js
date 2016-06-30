var extend = require('./neilviz/util/extend');
var model = require('./model');
var layoutStates = require('./layoutStates');





var statesArray = [{
        id: 'initial',
        layout: 0,
        camX: 0,
        camY: 0,
        camZ: 100,
        camRotX: 0,
        reflect: 1,
        lightI: 1,
        highlightPoverty: 0,
        highlightEpsilon: 0.5
    },
    {
        id: 'initialPullback',
        camZ: layoutStates.wholeCity.camPos.z + 50,
        layout: 1,
        reflect: 0

    },
    {
        id: 'splitToDepts',
        layout: 2,
        camX: layoutStates.deptByCat.camPos.x,
        camY: layoutStates.deptByCat.camPos.y,
        camZ: layoutStates.deptByCat.camPos.z,


    }, {
        id: 'groupByCats',
        camY: layoutStates.catTotals.camPos.y,
        layout: 3,
    }, {
        id: 'backToDepts',
        layout: 4,
        camZ: 700,
        camY: -300,
        //camRotX: -0.3,
    }, {
        id: 'povertyExamples',
        camX: -180,
        camY: 40,
        camZ: 400,
        lightI: 0.5,
        highlightPoverty: 1,
        highlightEpsilon: 0.12

    }, {
        id: 'preSecurity',
        lightI: 1,
        highlightPoverty: 0,
        highlightEpsilon: 0.5
    }, {
        id: 'securityExamples',
        camX: -320,
        lightI: 0.5,
        highlightSecurity: 1,
        highlightEpsilon: 0.12

    }
];


var states = {};
var state = {};


for (var i = 0; i < statesArray.length; i++) {
    var id = statesArray[i].id;
    statesArray[i].prevId = statesArray[Math.max(0, i - 1)].id;
    extend(state, statesArray[i]); //first arg means deep
    states[id] = extend({}, state); //deep clone

}



module.exports = states;
