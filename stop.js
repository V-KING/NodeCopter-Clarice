var arDrone = require('ar-drone');
var client  = arDrone.createClient();
console.log('Landing!!!');
client.land(function() {
	process.exit(0);
});