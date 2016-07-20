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
        reflect: 0.7,
        reflectPhoto:0,
        lightI: 1,
        highlightPoverty: 0,
        highlightEpsilon: 1,
        revealPCircles: 0,
        revealSCircles: 0,
        revealLowestPrice:0,
        revealRfp: 0,
        revealBidders:0,
        revealWinner: 0,
        revealBulbs: 0,
        revealCurses: 0,
        revealDothis:0

    },
    {
        id: 'initialPullback',
        camZ: layoutStates.wholeCity.camPos.z + 50,
        layout: 1,
        reflect: 0.1

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
        camX: -120,
        camY: 40,
        camZ: 400,
        lightI: 0.7,
        highlightPoverty: 1,
        highlightEpsilon: 0.2,
        revealPCircles: 1

    }, {
        id: 'preSecurity',
        lightI: 1,
        highlightPoverty: 0,
        revealPCircles: 2,
        highlightEpsilon: 1
    }, {
        id: 'securityExamples',
        camX: -180,
        camZ: 470,
        camY: -15,
        lightI: 0.7,
        revealSCircles: 1,
        highlightSecurity: 1,
        highlightEpsilon: 0.2

    }, {
        id: 'colorContracts',
      //  camX: 0,
        camY: -20,
        camZ: 450,
        layout: 5,
        lightI: 1,
        revealSCircles: 2,
        highlightSecurity: 0,

    }, {
        id: 'colorContractsDown',
        camX: 100,
        camY: -250,
        camZ: 350,
    }, {
        id: 'colorContractsBack',
        camX: 0,
        camY: -20,
        camZ: 450,
    }, {
        id: 'behavioralHealth',
        camX: -220,
        camY: 200,
        camZ: 240,
        layout: 6,


    }, {
    }, {
        id: 'behavioralHealthPhoto',
        reflectPhoto:1,
        camX: -250,
        camY: 220,
        camZ: 200,
        layout: 7,
        reflect:1,


    }, {
        id: 'contractNonContract',
        camX: 0,
        camY: -20,
        camZ: 450,
        layout: 8,
        reflect: 0.1



    }, {
        id: 'contractsImportant',
        camZ: 370,

    }, {
        id: 'procurement',
        camZ: 300,
        camX: 270,
        layout: 9,
        reflect: 0.8,
        revealLowestPrice:1


    }, {
        id: 'profServices',
        camZ: 180,
        camX: 200,
        reflect: 0.1
  }, {
      id: 'rfpReveal',
      camY: -260,
      revealRfp:1
  }, {
      id: 'rfpBidders',
      camX: 200,
      camY: -340,
      camZ: 270,
      revealBidders:1,
      revealWinner:1
  }, {
      id: 'bulbs',
      revealWinner:2,
      revealBulbs:1,
  }, {
      id: 'curses',
      revealCurses: 1,
      revealBulbs:2,
  }, {
      id: 'prescriptive',
      camX: 170,
      camY: -260,
      camZ: 130,
      revealCurses: 2,
      revealRfp:0.4,
      revealDothis:1
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
