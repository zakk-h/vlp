export const vlpDebugMode = (location.href.indexOf('debug')>=0);
export const addZakklab = (location.href.indexOf('zakklab')>=0) || ADD_ZAKKLAB;
export var vlpDebug = function() {};

if (vlpDebugMode) {
	vlpDebug = console.log;
	vlpDebug('Debug mode is activated for vlp app',location.href);
	if (addZakklab) vlpDebug('zakklab extension has been enabled');
}
