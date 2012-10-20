var arDrone = require('ar-drone'),
	clc = require('cli-color'),
	sugar = require('./cli-sugar.js');

module.exports.settings = {

	delay: 					500,
	speed: 					0.25,
	duration: 				1000,
	maxHeightMeters: 		0.8,
	defaultAltitude: 		0.7,

	debug: 					true,

	OnlyAllowUsers: 		false,

};

module.exports.drone = undefined;
module.exports.navdata = undefined;

module.exports.init = function() {

	module.exports.drone  = arDrone.createClient();

	module.exports.drone.takeoff();

	module.exports.drone.config('general:navdata_demo', 'FALSE');
	module.exports.lowBatteryWarning();

	// capture telemetry
	module.exports.drone.on('navdata', function(data) {
		module.exports.navdata = data;
		module.exports.detectMaxAltitude();
	});

	// create watchers
	setTimeout(function() {

		setInterval(function() {
			module.exports.lowBatteryWarning();
			if(typeof module.exports.navdata === 'undefined') {
				sugar.important('No telemetry recieved. Is the drone responding?');
			} else if(module.exports.settings.debug) {
				sugar.notification('Altitude: ' + module.exports.getAltitude());
			}
		}, 250);

	}, 1000);

	// go to in initial position
	module.exports.drone.after(100, function() {
	    module.exports.drone.takeoff(function() {
		    if(!module.exports.isAtMaxAltitude()) {
		    	module.exports.flyToAltitude(module.exports.settings.defaultAltitude);
		    }
	    });
	 });
	
	return module.exports.drone;

}

module.exports.isFlying = function() {
	return (module.exports.navdata && 
			navdata.droneState.flying == 1);
}

module.exports.getAltitude = function() {
	if(!module.exports.navdata) return 9999;
	return (module.exports.navdata.demo.altitudeMeters / 10);
}

module.exports.isAtMaxAltitude = function() {
	if(typeof module.exports.navdata === 'undefined') return -1;
	return ((module.exports.getAltitude() - module.exports.settings.maxHeightMeters) > 0);
}

module.exports.flyToAltitude = function(alt) {
	
	if(typeof module.exports.navdata === "undefined" || !module.exports.navdata.droneState.flying) return;

	var currentAlt = module.exports.getAltitude();

	// fly downwards
	if(alt < currentAlt) {
		sugar.alert('Flying DOWN to altitude: ' + alt + ' from ' + currentAlt);
		module.exports.drone.stop();
		module.exports.drone.down(module.exports.settings.speed);
		module.exports.drone.after(250, function() {
			module.exports.flyToAltitude(alt);
		});
	// fly upwards
	} else if(alt > currentAlt) {
		sugar.alert('Flying UP to altitude: ' + alt + ' from ' + currentAlt);
		module.exports.drone.stop();
		module.exports.drone.up(module.exports.settings.speed);
		module.exports.drone.after(250, function() {
			module.exports.flyToAltitude(alt);
		});
	} else {
		module.exports.drone.stop();
	}

}

module.exports.detectMaxAltitude = function() {

	if(!module.exports.settings.navdata) {
		// no data has been recieved yet

	} else if(module.exports.getAltitude() >= module.exports.settings.maxHeightMeters) {
		sugar.alert('DRONE EXCEEDS MAX ALTITUDE! ' + module.exports.getAltitude() + ' should be ' + module.exports.settings.maxHeightMeters);
		module.exports.flyToAltitude(module.exports.settings.defaultAltitude);
	}
}

module.exports.lowBatteryWarning = function() {
	if(module.exports.navdata !== undefined && module.exports.navdata.droneState.lowBattery != 0) {
		sugar.warning('BATTERY IS LOW!');
	}
}