var util = require("util");
var ParkingPlace = require('../domain/parkingplace');
var EventEmitter = require("events").EventEmitter;

function Repository(parkingPlacesNo) {
	EventEmitter.call(this);
	var self = this;
	this.parkingPlaces = [];
	for (var i = 1; i <= parkingPlacesNo; i++) {
		var pp = new ParkingPlace(i);
		this.parkingPlaces.push(pp);
	}
	this.onBindingData = function(data) {
		for (var i = 0; i < self.parkingPlaces.length; i++) {
			var pp = self.parkingPlaces[i];
			if (pp.id === data.parkingPlace) {
				if (pp.state !== data.newState) {
					pp.setState(data.newState);
					self.emit("data", pp);
					break;
				}
			}
		}
	};
}

util.inherits(Repository, EventEmitter);

module.exports = Repository;
