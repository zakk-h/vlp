const ParkingLot = require('./trails/ParkingLot.trail');
const GreenWay = require('./trails/GreenWay.trail');
const YellowConnector = require('./trails/YellowConnector.trail');
const RedOuter = require('./trails/RedOuter.trail');
const BlueLoop = require('./trails/BlueLoop.trail');
const MeditationPoint = require('./trails/MeditationPoint.trail');
const McGalliardGreenway = require('./trails/McGalliardGreenway.trail');
const HoyleCreek = require('./trails/HoyleCreek.trail');
const ShadeSeeker = require('./trails/ShadeSeeker.trail');
const OuterCreek = require('./trails/OuterCreek.trail');

const markersOrienteering = require('./markers/Orienteering.mapmarks');
const markersLandmarks = require('./markers/Landmarks.mapmarks');

const zakklab = require('./zakklab-addons.js');

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
	],
	zakklabTrails: zakklab.trails
};
