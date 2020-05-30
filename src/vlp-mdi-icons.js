import {
	mdiTableFurniture, mdiFlagTriangle, mdiCamera, mdiCarMultiple, mdiParking,
	mdiSailBoat, mdiBridge, mdiNature, mdiInformationOutline, mdiTableChair, mdiWaves,
	mdiBike, mdiFish
} from '@mdi/js';

// https://materialdesignicons.com
const mdiIcon = {
	bike: {
		svg: mdiBike,
		color: '#000000'
	},
	boat: {
		svg: mdiSailBoat,
		color: '#A52A2A'
	},
	bridge: {
		svg: mdiBridge,
		color: '#000000',
		outline: ['#000000', 0.75]
	},
	camera: {
		svg: mdiCamera,
		color: '#040421'
	},
	cars: {
		svg: mdiCarMultiple,
		color: '#A88C8C',
		outline: ['#000000']
	},
	fish: {
		svg: mdiFish,
		color: '#F6E35B',
		outline: ['#000000', 1.5]
	},
	flag: {
		svg: mdiFlagTriangle,
		color: '#EF6C00'
	},
	info: {
		svg: mdiInformationOutline,
		color: '#0000AA'
	},
	nature: {
		svg: mdiNature,
		color: '#00AA00'
	},
	parking: {
		svg: mdiParking,
		color: '#000000'
	},
	picnic: {
		svg: mdiTableFurniture,
		color: '#5C2F00'
	},
	tablechair: {
		svg: mdiTableChair,
		color: '#000000'
	},
	waves: {
		svg: mdiWaves,
		color: '#000066'
	},



}

export { mdiIcon };