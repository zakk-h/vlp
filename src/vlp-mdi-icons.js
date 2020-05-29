import {mdiTableFurniture, mdiFlagTriangle, mdiCamera, mdiCarMultiple, mdiParking, 
	mdiSailBoat, mdiBridge, mdiNature, mdiInformationOutline, mdiTableChair, mdiWaves,
	mdiFish} from '@mdi/js';

// https://materialdesignicons.com

const mdiIcon = {
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
	boat:	'#A52A2A',
	bridge:	'#000000',
	camera:	'#666666',
	cars:	'#800000',
	fish:	'#00AA00',
	flag:	'#EF6C00',
	info:	'#0000AA',
	nature:	'#00AA00',
	parking: '#000000',
	picnic:	'#5C4033',
	tablechair: '#000000',
	waves:	'#000066'
}

export {mdiIcon, mdiIconColor};
