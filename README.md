NodeCopter-Clarice
==================

##Introduction

NodeCopter-Clarice is a project I built for the one-day NodeCopter hackathon in Dublin October 2012.

The goal of the day is to create a project with Node.js and the Parrot AR 2.0 Drone Quadrocopter. Which just as a sentence on it's own is freakin' amazing, never mind the actual event itself. I highly recommend you do one where you live, it's incredibly cool stuff.

NodeCopter-Clarice makes use of the [Twitter-Starling](https://github.com/seannicholls/Twitter-Starling) library I had built, and continue to work on, which aims to bring easy to use REST and Streaming API functionality to Node.js 

For all intents and purposes, the objective of this project was achieved, unfortunately my drone had a bit of an accident and I could not finish my work in time to Demo <*sad panda face* />,

## How to Use

You probably shouldn't for a start, it was thrown together one in day and there was bugs that caused the drone to fly into the glass ceiling in Engine Yard's Dublin offices.

This I think, was what broke the poor drones back. 

Then again, at least 4 tried to kill me so.... we're even.

To actually use this project you will need:

* A Parrot AR Drone 2.0
* A device to communicate with the Drone, A laptop will do.
* If you are using the same device to communicate to the Drone as to stream Twitter, you will need a secondary network connection (3G Dongle, Ethernet, Second Wireless Card etc) that is on another subnet (the Drone uses 192.168.1.x)
* [Node AR Drone Library](https://github.com/felixge/node-ar-drone) by [felixge](https://github.com/felixge)
* [Twitter-Starling](https://github.com/seannicholls/Twitter-Starling) by [seannicholls](https://github.com/seannicholls)
* [cli-color]() by [medikoo](https://github.com/medikoo)
* [Twitter API Key](https://dev.twitter.com/discussions/631)
* Patience and/or a death wish

### to begin:

add the Twitter API Keys:

```javascript

var authorisedTwitter = new Twitter(new Twitter.LoginCredential(	'CONSUMER_TOKEN',
												'CONSUMER_SECRET',
												'ACCESS_TOKEN',
												'ACCESS_SECRET'	));

```

Ensure you are connected to both the AR Drone and the Internet

Customise the users permitted to control the drone (users.js)

```javascript

module.exports = [

	"allyourusers",

	"arebelongtous"
	
];

```
Customise the hashtag which identifies the tweet as a command-tweet (keywords.js)

```javascript

module.exports = [

	"MyDroneName"

];

```

run the following command


```bash

node nodecopter.js

```

The program should alert you of certain telemetrics such as low battery etc and enable you to control it by tweeting as follows

```
@sean_nicholls: #NodeCopterClarice #takeoff
```