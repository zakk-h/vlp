const ParkingLot = require('./trails/ParkingLot.js');
const GreenWay = require('./trails/GreenWay.js');
const YellowConnector = require('./trails/YellowConnector.js');
const RedOuter = require('./trails/RedOuter.js');
const BlueLoop = require('./trails/BlueLoop.js');
const MeditationPoint = require('./trails/MeditationPoint.js');
const McGalliardGreenway = require('./trails/McGalliardGreenway.js');
const HoyleCreek = require('./trails/HoyleCreek.js');
const ShadeSeeker = require('./trails/ShadeSeeker.js');
const OuterCreek = require('./trails/OuterCreek.js');

const markersOrienteering = require('./markers/Orienteering.js');
const markersLandmarks = require('./markers/Landmarks.js');

var vlpFishing = [
	[[35.7723, -81.5526], "fish", "Fox Den - A gentle slope down to the water."],
	[[35.774137, -81.548], "fish", "Fish Attractor at Picnic Area. Below the bottom picnic table there is room to fish."],
	[[35.77269, -81.55015], "fish", "Fish Attractor along the Greenway."]
];
var vlpPotentialTrails = [
[[35.768302, -81.557049], "nature", "Trail"],
[[35.769754, -81.556697], "nature", "Trail"],
[[35.770908, -81.555408], "nature", "Trail"],
[[35.770079, -81.554809], "nature", "Trail"],
[[35.771384, -81.553641], "nature", "Trail"],
[[35.771788, -81.550206], "nature", "Trail"],
[[35.771866, -81.551548], "nature", "Trail"],
[[35.771597, -81.552158], "nature", "Trail"],
[[35.772203, -81.546858], "nature", "Trail"],
[[35.772318, -81.547755], "nature", "Trail"],
[[35.769794, -81.558800], "nature", "Trail"],
[[35.772164, -81.558625], "nature", "Trail"],
[[35.770717, -81.560302], "nature", "Trail"],
[[35.769141, -81.559863], "nature", "Trail"],
[[35.768677, -81.558875], "nature", "Trail"],
[[35.769411, -81.559058], "nature", "Trail"],
[[35.768029, -81.554792], "nature", "Trail"],
[[35.769043, -81.553224], "nature", "Trail"],
[[35.769814, -81.552917], "nature", "Trail"],
[[35.765009, -81.551886], "nature", "Trail"],
[[35.763920, -81.551818], "nature", "Trail"],
[[35.767754, -81.546746], "nature", "Trail"],
[[35.768400, -81.549565], "nature", "Trail"],
[[35.768578, -81.547828], "nature", "Trail"],
[[35.767666, -81.547468], "nature", "Trail"],
[[35.766794, -81.548110], "nature", "Trail"],
[[35.770417, -81.554185], "Fork", "Fork"],
[[35.769251, -81.556595], "Middle", "Middle"],
[[35.768594, -81.558297], "Beginning of quez", "Beginning of quez"]
];
module.exports = {
	vlpTrails: [
		ParkingLot,
		GreenWay,
		YellowConnector,
		RedOuter,
		BlueLoop,
		MeditationPoint,
		McGalliardGreenway,
		HoyleCreek,
		ShadeSeeker,
		OuterCreek
	],
	vlpMarkers: [
		markersOrienteering,
		markersLandmarks
	]
};
