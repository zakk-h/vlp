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
