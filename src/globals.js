export const vlpDebugMode = (location.href.indexOf('debug')>=0);
export var vlpDebug = function() {};

if (vlpDebugMode) {
	vlpDebug = console.log;
	vlpDebug('Debug mode is activated for vlp app',location.href);
}
