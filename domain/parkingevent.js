var moment = require('moment');

function ParkingEvent(parkingPlace, newState) {
	this.parkingPlace = parkingPlace;
	this.newState = newState;
	this.timestamp = moment().format("DD.MM.YYYY HH:mm:ss");
}

module.exports = ParkingEvent;
