var Twitter = require('twitter-starling'),
	clc = require('cli-color'),
	droneFunc = require('./dronefunc.js'),
	sugar = require('./cli-sugar.js');

// data
var keywords = require('./keywords.js'),
	users = require('./users.js')
	commands = require('./commands.js');

// init
var drone  = droneFunc.init();

// twitter
var authorisedTwitter = new Twitter(new Twitter.LoginCredential(	'CONSUMER_KEY',
																	'CONSUMER_SECRET',
																	'ACCESS_TOKEN',
																	'ACCESS_SECRET'	));

function trackTwitter(track) {

	if(typeof track === 'undefined' || track.legth < 1) return;

	console.log('Tracking ' + track.length + ' keywords...');

	// sample the public timeline
	try {

		authorisedTwitter.stream.statuses.filter({ track: 	track }, function(result) {

			if(result.isSuccess) {
				actUponTweet(result.data);
			} else {
				console.log('Error: ' + result.error.message);
			}
			
		});

	} catch (e) {
		console.log(clc.redBright('Error: could not connect to twitter. Are you connected to the internet?'));
		process.exit(1);
	}

}

var tweet,
	hashtags = [],
	hasCMD = false,
	hashtag = "";
function actUponTweet(tweet) {

	try {

		tweet = JSON.parse(tweet);

		// ignore deletes & errors
		if(	typeof tweet.id === "undefined") { 
			return;
		}

		// print the tweet
		console.log(highLightKeywords(tweet));

		// exit if no commands exist
		hasCMD = false;
		hashtags = getTwitterHashtags(tweet);
		for(var i=0; i<hashtags.length; i++) {
			if(!in_array(commands, hashtags[i].toUpperCase())) {
				hasCMD = true;
			}
		}
		if(!hasCMD) return;

		// only allow users

		if(droneFunc.settings.OnlyAllowUsers && !in_array(users, tweet.user.screen_name)) {
			console.log(clc.redBright('ALERT! UNAUTHORISED DRONE CONTROL ATTEMPT BY ' + tweet.user.screen_name.toUpperCase()));
			return;
		}

		// commands
		for(var i=0; i<hashtags.length; i++) {
			hashtag = hashtags[i].toUpperCase();
			switch(hashtag) {

				case 'LAUNCH':
					drone.after(droneFunc.settings.delay, function() {
					    drone.takeoff();
					 }).after(droneFunc.settings.duration, function() {
					 	drone.stop();
					 });
					correctCommandLog(hashtag);
					break;

				case 'LAND':
					drone.after(droneFunc.settings.delay, function() {
					    drone.land();
					 }).after(droneFunc.settings.duration, function() {
					 	drone.stop();
					 });
					correctCommandLog(hashtag);
					break;

				case 'FORWARD':
					drone.after(droneFunc.settings.delay, function() {
					   drone.front(droneFunc.settings.speed);
					 }).after(droneFunc.settings.duration, function() {
					 	drone.stop();
					 });
					correctCommandLog(hashtag);
					break;

				case 'BACK':
					drone.after(droneFunc.settings.delay, function() {
					   drone.back(droneFunc.settings.speed);
					 }).after(droneFunc.settings.duration, function() {
					 	drone.stop();
					 });
					correctCommandLog(hashtag);
					break;

				case 'LEFT':
					drone.after(droneFunc.settings.delay, function() {
					   drone.left(droneFunc.settings.speed);
					 }).after(droneFunc.settings.duration, function() {
					 	drone.stop();
					 });
					correctCommandLog(hashtag);
					break;

				case 'RIGHT':
					drone.after(droneFunc.settings.delay, function() {
					   drone.right(droneFunc.settings.speed);
					 }).after(droneFunc.settings.duration, function() {
					 	drone.stop();
					 });
					correctCommandLog(hashtag);
					break;

				case 'UP':
					drone.after(droneFunc.settings.delay, function() {
					   drone.up(droneFunc.settings.speed, function() {
						   if(!droneFunc.isAtMaxAltitude()) {
						   	drone.after(droneFunc.settings.duration, function() {
							 	drone.stop();
							 });
						   }
					   });
					 })
					correctCommandLog(hashtag);
					break;

				case 'DOWN':
					drone.after(droneFunc.settings.delay, function() {
					   drone.down(droneFunc.settings.speed);
					 }).after(droneFunc.settings.duration, function() {
					 	drone.stop();
					 });
					correctCommandLog(hashtag);
					break;

				case 'ROTATE_LEFT':
					drone.after(droneFunc.settings.delay, function() {
					    // do something
					 }).after(droneFunc.settings.duration, function() {
					 	drone.stop();
					 });
					correctCommandLog(hashtag);
					break;

				case 'ROTATE_RIGHT':
					drone.after(droneFunc.settings.delay, function() {
					    // do something
					 }).after(droneFunc.settings.duration, function() {
					 	drone.stop();
					 });
					correctCommandLog(hashtag);
					break;

				case 'FLIP':
					drone.after(droneFunc.settings.delay, function() {
					   drone.animate('flipLeft', 15);
					 });
					correctCommandLog(hashtag);
					break;

			}

		}

	} catch(e) {

		console.log(clc.redBright('Error: ' + e));

	}

}

function correctCommandLog(cmd) {
	console.log(clc.green('>> COMMAND: ') + clc.greenBright(cmd));
}

// protection
process.on('exit', function () {
	drone.land();
	// TODO fork child process to connect & land
});

// SUGAR
function highLightKeywords(tweet) {

	var out = oneLinePls(tweet.text);

	// retweets
	if(tweet.retweeted == "true" || tweet.text.substring(0,2) == "RT") {
		var thecolor = clc.xterm(8);
		return thecolor('@' + tweet.user.screen_name + ': ' + out);
	}

	// hashtags
	for(var i=0; i<tweet.entities.hashtags.length; i++) {
		out = out.replace(new RegExp('(#' + tweet.entities.hashtags[i].text + ')', 'gi'),clc.magenta('#'+tweet.entities.hashtags[i].text));
	}

	// urls
	for(var i=0; i<tweet.entities.urls.length; i++) {
		out = out.replace(new RegExp('(' + tweet.entities.urls[i].url + ')', 'gi'),clc.yellow(tweet.entities.urls[i].url));
	}

	// users
	for(var i=0; i<tweet.entities.user_mentions.length; i++) {
		out = out.replace(new RegExp('(@' + tweet.entities.user_mentions[i].screen_name + ')', 'gi'),clc.cyan('@'+tweet.entities.user_mentions[i].screen_name));
	}
	
	// media
	if(tweet.entities.media) {
		for(var i=0; i<tweet.entities.media.length; i++) {
			var thecolor = clc.xterm(209);
			out = out.replace(new RegExp('(' + tweet.entities.media[i].url + ')', 'gi'),thecolor(tweet.entities.media[i].url));
		}
	}

	return clc.green('@' + tweet.user.screen_name + ': ') + out;

}

function oneLinePls(str) {
	return str.replace(/(\r\n|\n|\r)/gm,"");
}

function in_array(array, id) {
    for(var i=0;i<array.length;i++) {
        if(array[i] === id) {
            return true;
        }
    }
    return false;
}

function getTwitterHashtags(tweet) {
	var out = [];
	if(!tweet.entities.hashtags || tweet.entities.hashtags.length < 1) return [];
	for(var i=0; i<tweet.entities.hashtags.length; i++) {
		out.push(tweet.entities.hashtags[i].text);
	}
	return out;
}

// MAIN ENTRY
trackTwitter(keywords);


