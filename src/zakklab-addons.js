const DHSRoad = require('./zakklab/DHSRoad.trail');
const GreenDiagonal = require('./zakklab/GreenDiagonal.trail');
const LimeLoop = require('./zakklab/LimeLoop.trail');
const Pink = require('./zakklab/Pink.trail');
const PinkGreenConnector = require('./zakklab/PinkGreenConnector.trail');
const StoneSkipper = require('./zakklab/StoneSkipper.trail');
const XC1 = require('./zakklab/HighSchoolXCTrail1.trail');
const XC2 = require('./zakklab/HighSchoolXCTrail2.trail');
const XC3 = require('./zakklab/HighSchoolXCTrail3.trail');
//Connectors
const HelmetConnector = require('./zakklab/HelmetConnector.trail');
const HCConnector = require('./zakklab/HCConnector.trail');
const LoveladyConnector = require('./zakklab/LoveladyConnector.trail');
const ShadeConnector = require('./zakklab/ShadeConnector.trail');
const PinkConnector = require('./zakklab/PinkConnector.trail');
const HCBeachConnector = require('./zakklab/HCBeachConnector.trail');
const FireHydrant = require('./zakklab/FireHydrant.trail');
//Other
const DogPark = require('./zakklab/DogPark.trail');


var trails = [
	GreenDiagonal,
	LimeLoop,
	StoneSkipper,
	DHSRoad,
	Pink,
	PinkGreenConnector,
	PinkConnector,
	HelmetConnector,
	HCConnector,
	LoveladyConnector,
	ShadeConnector,
	HCBeachConnector,
	FireHydrant,
	XC1,
	XC2,
	XC3,
	DogPark
];

module.exports = {
	trails: trails
};
