export var vlpConfig = {
	gpsBoundsLayerRotate: -1.5,
	gpsBoundsValdese: [[35.721650, -81.597445], [35.784838, -81.514709]],
	gpsBoundsParkContour: [[35.76295, -81.5668], [35.7765, -81.5433]],
	gpsBoundsParkPlan: [[35.7632, -81.5670], [35.7765, -81.54284]],
	gpsBoundsSatellite: [[35.75907, -81.57701], [35.78042, -81.523604]],
	osmZoomRange: [8, 15],
	osmTileRanges: {
		8: [[66, 98], [73, 102]],
		9: [[136, 199], [143, 203]],
		10: [[276, 401], [283, 404]],
		11: [[556, 804], [563, 807]],
		12: [[1115, 1608], [1124, 1615]],
		13: [[2234, 3219], [2244, 3227]],
		14: [[4475, 6442], [4486, 6452]],
		15: [[8956, 12890], [8965, 12898]]
	},
	//urlTileServer: 'https://static.valdese.net/osm/{z}/{x}_{y}.png'
	urlTileServer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
};
