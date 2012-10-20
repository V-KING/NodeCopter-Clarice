
var clc = require('cli-color');

// sugar
module.exports.alert = function(msg) {
	console.log(clc.redBright('ALERT! ' + msg));
}

module.exports.warning = function(msg) {
	console.log(clc.red('WARNING! ' + msg));
}

module.exports.success = function(msg) {
	console.log(clc.greenBright('SUCCESS ' + msg));
}

module.exports.notification = function(msg) {
	console.log(clc.yellow('NOTIFICATION: ' + msg));
}

module.exports.important = function(msg) {
	console.log(clc.redBright('IMPORTANT: ') + clc.yellow(msg));
}