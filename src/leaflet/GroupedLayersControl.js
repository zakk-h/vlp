// This plugin has been largely copied from
// - https://github.com/ismyrnow/leaflet-groupedlayercontrol
// with fixes from:
// - https://github.com/NHellFire/leaflet-groupedlayercontrol
// - https://github.com/jsthivierge/leaflet-groupedlayercontrol
// - https://github.com/newmanw/leaflet-groupedlayercontrol

/* global L */

// A layer control which provides for layer groupings.
// Author: Ishmael Smyrnow
var GroupedLayersControl = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topright',
		autoZIndex: true,
		exclusiveGroups: [],
		groupCheckboxes: true
	},

	initialize: function (baseLayers, groupedOverlays, options) {
		var i, j;
		L.Util.setOptions(this, options);

		this._layers = [];
		this._lastZIndex = 0;
		this._handlingClick = false;
		this._groupList = [];
		this._domGroups = [];

		for (i in baseLayers) {
			this._addLayer(baseLayers[i], i);
		}

		for (i in groupedOverlays) {
			for (j in groupedOverlays[i]) {
				this._addLayer(groupedOverlays[i][j], j, i, true);
			}
		}
	},

	onAdd: function (map) {
		this._initLayout();
		this._update();

		map
			.on('layeradd', this._onLayerChange, this)
			.on('layerremove', this._onLayerChange, this);

		return this._container;
	},

	onRemove: function (map) {
		map
			.off('layeradd', this._onLayerChange, this)
			.off('layerremove', this._onLayerChange, this);
	},

	addBaseLayer: function (layer, name) {
		this._addLayer(layer, name);
		this._update();
		return this;
	},

	addOverlay: function (layer, name, group) {
		this._addLayer(layer, name, group, true);
		this._update();
		return this;
	},

	removeLayer: function (layer) {
		var id = L.Util.stamp(layer);
		var _layer = this._getLayer(id);
		if (_layer) {
			this._layers.splice(this._layers.indexOf(_layer), 1);
		}
		this._update();
		return this;
	},

	_getLayer: function (id) {
		for (var i = 0; i < this._layers.length; i++) {
			if (this._layers[i] && L.stamp(this._layers[i].layer) === id) {
				return this._layers[i];
			}
		}
	},

	_initLayout: function () {
		var className = 'leaflet-control-layers',
			container = this._container = L.DomUtil.create('div', className),
			collapsed = this.options.collapsed;

		// Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		// Block click/scroll events so that map doesn't zoom when interacting with the layer control
		L.DomEvent.disableClickPropagation(container);
		L.DomEvent.disableScrollPropagation(container);

		var form = this._form = L.DomUtil.create('form', className + '-list');

		if (collapsed) {
			var link = this._layersLink = L.DomUtil.create('a','fvrIconButton', container);
			L.DomUtil.addClass(link,'layersBtn');
			link.title = 'Layers';
			link.style.opacity = 0.8;
			L.DomUtil.create('i','fvricon fvricon-layers',link);
			L.DomEvent.on(link,'click', this._expand, this);
			this._map.on('click', this._collapse, this);
		} else {
			this._expand();
		}

		this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
		this._separator = L.DomUtil.create('div', className + '-separator', form);
		this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

		container.appendChild(form);
	},

	_addLayer: function (layer, name, group, overlay) {
		var id = L.Util.stamp(layer);

		var _layer = {
			layer: layer,
			name: name,
			overlay: overlay
		};
		this._layers.push(_layer);

		group = group || '';
		var groupId = this._indexOf(this._groupList, group);

		if (groupId === -1) {
			groupId = this._groupList.push(group) - 1;
		}

		var exclusive = (this._indexOf(this.options.exclusiveGroups, group) !== -1);

		_layer.group = {
			name: group,
			id: groupId,
			exclusive: exclusive
		};

		if (this.options.autoZIndex && layer.setZIndex) {
			this._lastZIndex++;
			layer.setZIndex(this._lastZIndex);
		}
	},

	_update: function () {
		if (!this._container) {
			return;
		}

		this._baseLayersList.innerHTML = '';
		this._overlaysList.innerHTML = '';
		this._domGroups.length = 0;

		var baseLayersPresent = false,
			overlaysPresent = false,
			i, obj;

		for (var i = 0; i < this._layers.length; i++) {
			obj = this._layers[i];
			this._addItem(obj);
			overlaysPresent = overlaysPresent || obj.overlay;
			baseLayersPresent = baseLayersPresent || !obj.overlay;
		}

		if (this.options.groupCheckboxes) {
			this._refreshGroupsCheckStates();
		}

		this._separator.style.display = (overlaysPresent || baseLayersPresent) ? '' : 'none';
	},

	_onLayerChange: function (e) {
		var obj = this._getLayer(L.Util.stamp(e.layer)),
			type;

		if (!obj) {
			return;
		}

		if (!this._handlingClick) {
			this._update();
		}

		if (obj.overlay) {
			type = e.type === 'layeradd' ? 'overlayadd' : 'overlayremove';
		} else {
			type = e.type === 'layeradd' ? 'baselayerchange' : null;
		}

		if (type) {
			this._map.fire(type, obj);
		}
	},

	// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
	_createRadioElement: function (name, checked) {
		var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"';
		if (checked) {
			radioHtml += ' checked="checked"';
		}
		radioHtml += '/>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = radioHtml;

		return radioFragment.firstChild;
	},

	_addItem: function (obj) {
		var label = document.createElement('label'),
			input,
			checked = this._map.hasLayer(obj.layer),
			container,
			groupRadioName;

		if (obj.overlay) {
			if (obj.group.exclusive) {
				groupRadioName = 'leaflet-exclusive-group-layer-' + obj.group.id;
				input = this._createRadioElement(groupRadioName, checked);
			} else {
				input = document.createElement('input');
				input.type = 'checkbox';
				input.className = 'leaflet-control-layers-selector';
				input.defaultChecked = checked;
			}
		} else {
			input = this._createRadioElement('leaflet-base-layers', checked);
		}

		input.layerId = L.Util.stamp(obj.layer);
		input.groupID = obj.group.id;
		L.DomEvent.on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		label.appendChild(input);
		label.appendChild(name);

		if (obj.overlay) {
			container = this._overlaysList;

			var groupContainer = this._domGroups[obj.group.id];

			// Create the group container if it doesn't exist
			if (!groupContainer) {
				groupContainer = document.createElement('div');
				groupContainer.className = 'leaflet-control-layers-group';
				groupContainer.id = 'leaflet-control-layers-group-' + obj.group.id;

				var groupLabel = document.createElement('label');
				groupLabel.className = 'leaflet-control-layers-group-label';

				if (obj.group.name !== '' && !obj.group.exclusive) {
					// ------ add a group checkbox with an _onInputClickGroup function
					if (this.options.groupCheckboxes) {
						var groupInput = document.createElement('input');
						groupInput.type = 'checkbox';
						groupInput.className = 'leaflet-control-layers-group-selector';
						groupInput.groupID = obj.group.id;
						groupInput.legend = this;
						L.DomEvent.on(groupInput, 'click', this._onGroupInputClick, groupInput);
						groupLabel.appendChild(groupInput);
					}
				}

				var groupName = document.createElement('span');
				groupName.className = 'leaflet-control-layers-group-name';
				groupName.innerHTML = obj.group.name;
				groupLabel.appendChild(groupName);

				groupContainer.appendChild(groupLabel);
				container.appendChild(groupContainer);

				this._domGroups[obj.group.id] = groupContainer;
			}

			container = groupContainer;
		} else {
			container = this._baseLayersList;
		}

		container.appendChild(label);

		return label;
	},

	_onGroupInputClick: function () {
		var i, input, obj;

		var this_legend = this.legend;
		this_legend._handlingClick = true;

		var inputs = this_legend._form.getElementsByTagName('input');
		var inputsLen = inputs.length;

		for (i = 0; i < inputsLen; i++) {
			input = inputs[i];
			if (input.groupID === this.groupID && input.className === 'leaflet-control-layers-selector') {
				input.checked = this.checked;
				obj = this_legend._getLayer(input.layerId);
				if (input.checked && !this_legend._map.hasLayer(obj.layer)) {
					this_legend._map.addLayer(obj.layer);
				} else if (!input.checked && this_legend._map.hasLayer(obj.layer)) {
					this_legend._map.removeLayer(obj.layer);
				}
			}
		}

		this_legend._handlingClick = false;
	},

	_onInputClick: function () {
		var i, input, obj,
			inputs = this._form.getElementsByTagName('input'),
			inputsLen = inputs.length;

		this._handlingClick = true;

		for (i = 0; i < inputsLen; i++) {
			input = inputs[i];
			if (input.className === 'leaflet-control-layers-selector') {
				obj = this._getLayer(input.layerId);

				if (input.checked && !this._map.hasLayer(obj.layer)) {
					this._map.addLayer(obj.layer);
				} else if (!input.checked && this._map.hasLayer(obj.layer)) {
					this._map.removeLayer(obj.layer);
				}
			}
		}

		if (this.options.groupCheckboxes) {
			this._refreshGroupsCheckStates();
		}

		this._handlingClick = false;
	},

	_refreshGroupsCheckStates: function () {
		for (var i = 0; i < this._domGroups.length; i++) {
			var groupContainer = this._domGroups[i];
			if (groupContainer) {

				var groupInput = groupContainer.getElementsByClassName('leaflet-control-layers-group-selector')[0];
				var groupItemInputs = groupContainer.querySelectorAll('input.leaflet-control-layers-selector');
				var checkedGroupItemInputs = groupContainer.querySelectorAll('input.leaflet-control-layers-selector:checked');

				if (groupInput) {
					groupInput.indeterminate = false;
					if (checkedGroupItemInputs.length === groupItemInputs.length) {
						groupInput.checked = true;
					} else if (checkedGroupItemInputs.length === 0) {
						groupInput.checked = false;
					} else {
						groupInput.indeterminate = true;
					}
				}
			}
		}
	},

	_expand: function () {
		L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
		var acceptableHeight = Math.round(this._map._size.y * 0.8);
		this._form.style.maxHeight = acceptableHeight+'px';
		this._form.scrollTop = null;
	},

	_collapse: function () {
		this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', '');
	},

	_indexOf: function (arr, obj) {
		for (var i = 0, j = arr.length; i < j; i++) {
			if (arr[i] === obj) {
				return i;
			}
		}
		return -1;
	}
});

export {GroupedLayersControl};
