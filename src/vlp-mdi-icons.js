import {mdiTableFurniture, mdiFlagTriangle, mdiCamera, mdiCarMultiple, mdiParking, 
	mdiSailBoat, mdiBridge, mdiNature, mdiInformationOutline, mdiTableChair, mdiWaves, mdiBike,
	mdiFish} from '@mdi/js';

// https://materialdesignicons.com

const mdiIcon = {
    bike:   mdiBike,
    boat:	mdiSailBoat,
	bridge:	mdiBridge,
	camera:	mdiCamera,
	cars:	mdiCarMultiple,
	fish:	mdiFish,
	flag:	mdiFlagTriangle,
	info:	mdiInformationOutline,
	nature:	mdiNature,
	parking: mdiParking,
	picnic:	mdiTableFurniture,
	tablechair: mdiTableChair,
	waves:	mdiWaves
}

const mdiIconColor = {
    bike:   '#000000',
    boat:	'#A52A2A',
	bridge:	'#000000',
	camera:	'#040421',
	cars:	'#800000',
	fish:	'#F6E35B', 
	flag:	'#EF6C00',
	info:	'#0000AA',
	nature:	'#00AA00',
	parking: '#000000',
	picnic:	'#5C2F00', 
	tablechair: '#000000',
	waves:	'#000066'
}
const mdiIconOutline = {
    fish:	'#000000',
    bridge:	'#000000'
}
const mdiIconOutlineWidth = {
    fish:	'1.5',
    bridge: '.75'
}
export {mdiIcon, mdiIconColor, mdiIconOutline, mdiIconOutlineWidth};
