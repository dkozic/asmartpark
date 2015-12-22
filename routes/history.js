var DbManager = require('../components/dbmanager');
var ParkingPlace = require('../domain/parkingplace');

exports.list = function(req, res, next) {

	var ppId = req.params.id;

	var dbManager = new DbManager();
	var history = [];

	dbManager.findByParkinglace(ppId, function(err, rows) {
		if (err) {
			return next(err);
		}
		res.render('history', {
			title : 'History',
			history : rows,
			parkingplace: ppId
		});

	});
};

