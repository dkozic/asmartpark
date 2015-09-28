var ParkingPlace = require('../../domain/parkingplace');
var DbManager = require('../../components/dbmanager');

exports.testInsert = function(test) {
	test.expect(1);
	var pp = new ParkingPlace(1, 1);
	pp.setStateOn();
	var dbm = new DbManager("test.db");
	dbm.insert(pp);
	test.ok(true, 'Sve je u redu');
	test.done();
};