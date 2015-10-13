var util = require("util");
var EventEmitter = require("events").EventEmitter;
var ParkingEvent = require("../../domain/parkingevent");

function TinynodeBinding(url, pollingInterval) {
	EventEmitter.call(this);
	this.url = url;
	this.pollingInterval = pollingInterval;
}

util.inherits(TinynodeBinding, EventEmitter);

TinynodeBinding.prototype.start = function() {
	var self = this;
	setInterval(function() {
		var randomPP = Math.floor((Math.random() * 6) + 1); 
		var randomPPS = Math.floor((Math.random() * 2));
		var data = new ParkingEvent(randomPP, randomPPS);
		self.emit("data", data);
	}, this.pollingInterval);
};

module.exports = TinynodeBinding;