import {mdiTableFurniture, mdiFlagTriangle, mdiCamera, mdiCarMultiple, mdiParking,
	mdiSailBoat, mdiBridge, mdiNature, mdiInformationOutline, mdiTableChair,mdiWaves,
	mdiBike, mdiFish } from '@mdi/js';

// https://materialdesignicons.com

const mdiIcon = {
	bike: mdiBike,
	boat: mdiSailBoat,
	bridge: mdiBridge,
	camera: mdiCamera,
	cars: mdiCarMultiple,
	fish: mdiFish,
	flag: mdiFlagTriangle,
	info: mdiInformationOutline,
	nature: mdiNature,
	parking: mdiParking,
	picnic: mdiTableFurniture,
	tablechair: mdiTableChair,
	waves: mdiWaves
}

const mdiIconColor = {
	bike: '#000000',
	boat: '#A52A2A',
	bridge: '#000000',
	camera: '#040421',
	cars: '#A88C8C',
	fish: '#F6E35B',
	flag: '#EF6C00',
	info: '#0000AA',
	nature: '#00AA00',
	parking: '#000000',
	picnic: '#5C2F00',
	tablechair: '#000000',
	waves: '#000066'
}
const mdiIconOutline = {
	bridge: '#000000',
	fish: '#000000',
	cars: '#000000'
}
const mdiIconOutlineWidth = {
	fish: '1.5',
	bridge: '.75',

}

export{mdiIcon, mdiIconColor, mdiIconOutline, mdiIconOutlineWidth};

/*
import {
	mdiTableFurniture, mdiFlagTriangle, mdiCamera, mdiCarMultiple, mdiParking,
	mdiSailBoat, mdiBridge, mdiNature, mdiInformationOutline, mdiTableChair, mdiWaves,
	mdiBike, mdiFish
} from '@mdi/js';

// https://materialdesignicons.com
const mdiIcon = {
	bike: {
		svg: mdiBike,
		color: '#000000',
		outline: ['#FFFFFF'],
		outlinewidth: [1.0]
	},
	boat: {
		svg: mdiSailBoat,
		color: '#A52A2A',
		outline: ['#FFFFFF'],
		outlinewidth: [1.0]
	},
	bridge: {
		svg: mdiBridge,
		color: '#000000',
		outline: ['#000000'],
		outlinewidth: [0.75]
	},
	camera: {
		svg: mdiCamera,
		color: '#040421',
		outline: ['#FFFFFF'],
		outlinewidth: [1.0]
	},
	cars: {
		svg: mdiCarMultiple,
		color: '#A88C8C',
		outline: ['#000000'],
		outlinewidth: [1.0]
	},
	fish: {
		svg: mdiFish,
		color: '#F6E35B',
		outline: ['#000000'],
		outlinewidth: [1.5]
	},
	flag: {
		svg: mdiFlagTriangle,
		color: '#EF6C00',
		outline: ['#FFFFFF'],
		outlinewidth: [1.0]
	},
	info: {
		svg: mdiInformationOutline,
		color: '#0000AA',
		outline: ['#FFFFFF'],
		outlinewidth: [1.0]
	},
	nature: {
		svg: mdiNature,
		color: '#00AA00',
		outline: ['#FFFFFF'],
		outlinewidth: [1.0]
	},
	parking: {
		svg: mdiParking,
		color: '#000000',
		outline: ['#FFFFFF'],
		outlinewidth: [1.0]
	},
	picnic: {
		svg: mdiTableFurniture,
		color: '#5C2F00',
		outline: ['#FFFFFF'],
		outlinewidth: [1.0]
	},
	tablechair: {
		svg: mdiTableChair,
		color: '#000000',
		outline: ['#FFFFFF'],
		outlinewidth: [1.0]
	},
	waves: {
		svg: mdiWaves,
		color: '#000066',
		outline: ['#FFFFFF'],
		outlinewidth: [1.0]
	},



}

export { mdiIcon };
*/