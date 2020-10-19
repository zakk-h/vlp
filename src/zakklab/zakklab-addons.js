const DHSRoad = require('./trails/DHSRoad.trail');
const GreenDiagonal = require('./trails/GreenDiagonal.trail');
const LimeLoop = require('./trails/LimeLoop.trail');
const Pink = require('./trails/Pink.trail');
const PinkGreenConnector = require('./trails/PinkGreenConnector.trail');
const StoneSkipper = require('./trails/StoneSkipper.trail');
const XC1 = require('./trails/HighSchoolXCTrail1.trail');
const XC2 = require('./trails/HighSchoolXCTrail2.trail');
const XC3 = require('./trails/HighSchoolXCTrail3.trail');
const MCGF = require('./trails/McGalliardFalls.trail');
//Connectors
const HelmetConnector = require('./trails/HelmetConnector.trail');
const HCConnector = require('./trails/HCConnector.trail');
const LoveladyConnector = require('./trails/LoveladyConnector.trail');
const ShadeConnector = require('./trails/ShadeConnector.trail');
const PinkConnector = require('./trails/PinkConnector.trail');
const HCBeachConnector = require('./trails/HCBeachConnector.trail');
const FireHydrant = require('./trails/FireHydrant.trail');
const OuterConnector = require('./trails/OuterConnector.trail');
//Other
const DogPark = require('./trails/DogPark.trail');


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
	OuterConnector,
	XC1,
	XC2,
	XC3,
	MCGF,
	DogPark
];

module.exports = {
	trails: trails
};
