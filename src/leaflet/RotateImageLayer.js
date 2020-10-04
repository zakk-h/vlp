//transform: skewY(-5deg);
var RotateImageLayer = L.ImageOverlay.extend({
	options: {rotation: -1.5},
	initialize: function(url,bounds,options) {
		L.setOptions(this,options);
		L.ImageOverlay.prototype.initialize.call(this,url,bounds,options);
    },
    _animateZoom: function(e){
		L.ImageOverlay.prototype._animateZoom.call(this, e);
        var img = this._image;
        img.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.rotation + 'deg)';
    },
    _reset: function(){
        L.ImageOverlay.prototype._reset.call(this);
        var img = this._image;
        img.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.rotation + 'deg)';
    }
});

export {RotateImageLayer};