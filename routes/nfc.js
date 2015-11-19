var NfcClient = require('../bindings/nfc/nfcclient');

var IP = "172.25.0.19";
var PORT = 4001;

var nfcClient = new NfcClient(IP, PORT);

exports.view = function(req, res, next) {

	res.render('nfc', {
		title : 'NFC'
	});
};

exports.getDateTime = function(req, res, next) {

	nfcClient.getDateTime(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			getDateTime : data
		});
	});

};

exports.setDateTime = function(req, res, next) {
	var dateTime = req.query.dateTime;
	console.log("dateTime request param: " + dateTime);

	//validation
	req.assert('dateTime', 'DateTime is required').notEmpty();
	req.assert('dateTime', 'Duzina od DateTime nije dobra. Mora biti 12').len(12, 12);
	req.assert('dateTime', 'DateTime mora biti sastavljen od cifara').matches(/[0-9]/);

	var errors = req.validationErrors();

	var dateTimeObject = {};
	dateTimeObject.year = dateTime.substr(0, 2);
	dateTimeObject.month = dateTime.substr(2, 2);
	dateTimeObject.day = dateTime.substr(4, 2);
	dateTimeObject.hour = dateTime.substr(6, 2);
	dateTimeObject.minute = dateTime.substr(8, 2);
	dateTimeObject.second = dateTime.substr(10, 2);

	if (errors) {
		req.flash('errors', errors);
		res.render('nfc', {
			title: 'NFC',
			dateTime: dateTime
		});
	} else {

		nfcClient.setDateTime(function(data) {
			if (data instanceof Error) {
				return next(data);
			}
			res.render('nfc', {
				title : 'NFC',
				setDateTime : data
			});
		}, dateTimeObject);
	}

};

exports.startRFWork = function(req, res, next) {

	nfcClient.startRFWork(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			startRFWork : data
		});
	});

};

exports.stopRFWork = function(req, res, next) {

	nfcClient.stopRFWork(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			stopRFWork : data
		});
	});

};

exports.resetReader = function(req, res, next) {

	nfcClient.resetReader(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			resetReader : data
		});
	});

};

exports.getFirmwareVersion = function(req, res, next) {

	nfcClient.getFirmwareVersion(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			getFirmwareVersion : data
		});
	});

};

exports.getTrigState = function(req, res, next) {

	nfcClient.getTrigState(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			getTrigState : data
		});
	});

};

exports.getRelayState = function(req, res, next) {

	nfcClient.getRelayState(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			getRelayState : data
		});
	});

};

exports.setRelayState = function(req, res, next) {
	var Bitmask = require('generic-bitmask').Mask;
	var mask = new Bitmask();
	var relayState = req.query.relayState;
	console.log("relayState request param: " + relayState);

	//validation
	req.assert('relayState', 'RelayState is required').notEmpty();
	req.assert('relayState', 'Duzina od RelayState nije dobra. Mora biti 2').len(0, 5);
	//req.assert('relayState', 'RelayState mora biti sastavljen od cifara').matches(/[a-zA-Z0-9]/);
	mask.add(3);

	var errors = req.validationErrors();

	var relayStateObject = {};
	//relayStateObject.mask = relayState.substr(0, 5);
	//relayStateObject.state = relayState.substr(0, 5);

	if (errors) {
		req.flash('errors', errors);
		res.render('nfc', {
			title: 'NFC',
			relayState: relayState
		});
	} else {

		nfcClient.setRelayState(function(data) {
			if (data instanceof Error) {
				return next(data);
			}
			res.render('nfc', {
				title : 'NFC',
				setRelayState : data
			});
		}, relayStateObject);
	}

};

exports.masterAcknowledge = function(req, res, next) {

	nfcClient.masterAcknowledge(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			masterAcknowledge : "DONE"
		});
	});

};
