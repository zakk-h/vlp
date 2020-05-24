export const vlpDebugMode = (location.href.indexOf('debug')>=0);
export const addZakklab = (location.href.indexOf('zakklab')>=0);
export var vlpDebug = function() {};

export function sprintf(s,...a) {
	var i=0;
	return s.replace(/%[%dfos]/g, function (m) { return m=="%%" ? "%" : a[i++].toString(); });
}

if (vlpDebugMode) {
	vlpDebug = console.log;
	vlpDebug('Debug mode is activated for vlp app',location.href);
	if (addZakklab) vlpDebug('zakklab extension has been enabled');
}
