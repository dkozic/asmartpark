var moment = require('moment');
var STATE = require('./parkingplacestate');

function ParkingPlace(id, state, stateTimestamp) {
	this.id = id;
	if (state === undefined) {
		this.state = STATE.UNKNOWN;
	} else {
		this.state = state;
	}
	if (stateTimestamp === undefined) {
		this.stateTimestamp = "";
	} else {
		this.stateTimestamp = stateTimestamp;
	}
}

ParkingPlace.prototype.isStateUnknown = function() {
	return this.id === STATE.UNKNOWN;
};

ParkingPlace.prototype.isStateOn = function() {
	return this.id === STATE.ON;
};

ParkingPlace.prototype.isStateOf = function() {
	return this.id === STATE.OFF;
};

ParkingPlace.prototype.setState = function(newState) {
	this.state = newState;
	this.stateTimestamp = moment().format("DD.MM.YYYY HH:mm:ss");
};

ParkingPlace.prototype.setStateOn = function() {
	this.setState(STATE.ON);
};

ParkingPlace.prototype.setStateOff = function() {
	this.setState(STATE.OF);
};

module.exports = ParkingPlace;
