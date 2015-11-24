<<<<<<< HEAD
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
	
	var relayState = req.query.relayState;
	console.log("relayState request param: " + relayState);
	
	var relay1 = req.query.relay1;
	console.log("relay1 request param: " + relay1);

	var relay2 = req.query.relay2;
	console.log("relay2 request param: " + relay2);

	var relayState = {};
	relayState.relay1 = relay1?true:false;
	relayState.relay2 = relay2?true:false;

    nfcClient.setRelayState(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			setRelayState : data
		});
	}, relayState);
    

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
=======
var NfcClient = require('../bindings/nfc/nfcclient');

var IP = "172.25.0.19";
var PORT = 4001;

var nfcClient = new NfcClient(IP, PORT);

exports.view = function(req, res) {

	res.render('nfc', {
		title : 'NFC'
	});
};

exports.getDateTime = function(req, res, next) {

	nfcClient.getDateTime(function(error, command, response) {
		if (error) {
			return next(error);
		}
		var getDateTime = {};
		getDateTime.year = response.fields.responseData[0] + 2008;
		getDateTime.month = response.fields.responseData[1];
		getDateTime.day = response.fields.responseData[2];
		getDateTime.hour = response.fields.responseData[3];
		getDateTime.minute = response.fields.responseData[4];
		getDateTime.second = response.fields.responseData[5];

		res.render('nfc', {
			title : 'NFC',
			command: command,
			response: response,
			getDateTime : getDateTime
		});
	});

};

exports.setDateTime = function(req, res, next) {
	var dateTime = req.query.dateTime;
	console.log("dateTime request param: " + dateTime);

	//validation
	req.assert('dateTime', 'DateTime is required').notEmpty();
	req.assert('dateTime', 'Duzina od DateTime nije dobra. Mora biti 14').len(14, 14);
	req.assert('dateTime', 'DateTime mora biti sastavljen od cifara').matches(/[0-9]/);

	var errors = req.validationErrors();

	var setDateTime = {};
	setDateTime.year = dateTime.substr(0, 4) - 2008;
	setDateTime.month = dateTime.substr(4, 2);
	setDateTime.day = dateTime.substr(6, 2);
	setDateTime.hour = dateTime.substr(8, 2);
	setDateTime.minute = dateTime.substr(10, 2);
	setDateTime.second = dateTime.substr(12, 2);

	if (errors) {
		req.flash('errors', errors);
		res.render('nfc', {
			title: 'NFC',
			dateTime: dateTime
		});
	} else {

		nfcClient.setDateTime(function(error, command, response) {
			if (error) {
				return next(error);
			}
			res.render('nfc', {
				title : 'NFC',
				command: command,
				response: response,
				dateTime : dateTime,
				setDateTime: "DONE"
			});
		}, setDateTime);
	}

};

exports.startRFWork = function(req, res, next) {

	nfcClient.startRFWork(function(error, command, response) {
		if (error) {
			return next(error);
		}
		res.render('nfc', {
			title : 'NFC',
			command: command,
			response: response,
			startRFWork : "DONE"
		});
	});

};

exports.stopRFWork = function(req, res, next) {

	nfcClient.stopRFWork(function(error, command, response) {
		if (error) {
			return next(error);
		}
		res.render('nfc', {
			title : 'NFC',
			command: command,
			response: response,
			stopRFWork : "DONE"
		});
	});
};

exports.resetReader = function(req, res, next) {

	nfcClient.resetReader(function(error, command, response) {
		if (error) {
			return next(error);
		}
		res.render('nfc', {
			title : 'NFC',
			command: command,
			response: response,
			resetReader : "DONE"
		});
	});

};

exports.getFirmwareVersion = function(req, res, next) {

	nfcClient.getFirmwareVersion(function(error, command, response) {
		if (error) {
			return next(error);
		}

		var getFirmwareVersion = {};
		getFirmwareVersion.flag = response.fields.responseData[0];
		getFirmwareVersion.major = response.fields.responseData[1];
		getFirmwareVersion.minor = response.fields.responseData[2];
		getFirmwareVersion.release = response.fields.responseData[3];

		res.render('nfc', {
			title : 'NFC',
			command: command,
			response: response,
			getFirmwareVersion : getFirmwareVersion
		});
	});

};

exports.getTrigState = function(req, res, next) {

	nfcClient.getTrigState(function(error, command, response) {
		if (error) {
			return next(error);
		}

		var getTrigState = {};
		getTrigState.state = response.fields.state;

		res.render('nfc', {
			title : 'NFC',
			command: command,
			response: response,
			getTrigState : getTrigState
		});
	});

};

exports.getRelayState = function(req, res, next) {

	nfcClient.getRelayState(function(error, command, response) {
		if (error) {
			return next(error);
		}
		var getRelayState = {};
		getRelayState.relay1 = response.fields.state & 0x01;
		getRelayState.relay2 = response.fields.state & 0x02;

		res.render('nfc', {
			title : 'NFC',
			command: command,
			response: response,
			getRelayState : getRelayState
		});
	});

};

exports.setRelayState = function(req, res, next) {
	var relay1 = req.query.relay1;
	console.log("relay1 request param: " + relay1);

	var relay2 = req.query.relay2;
	console.log("relay2 request param: " + relay2);

	var setRelayState = {};
	setRelayState.relay1 = relay1 ? true : false;
	setRelayState.relay2 = relay2 ? true : false;

    nfcClient.setRelayState(function(error, command, response) {
		if (error) {
			return next(error);
		}
		res.render('nfc', {
			title : 'NFC',
			command: command,
			response: response,
			setRelayState : setRelayState
		});
	}, setRelayState);

};

exports.masterAcknowledge = function(req, res, next) {

	nfcClient.masterAcknowledge(function(error, command) {
		if (error) {
			return next(error);
		}
		res.render('nfc', {
			title : 'NFC',
			command: command,
			masterAcknowledge : "DONE"
		});
	});

};
>>>>>>> refs/remotes/origin/drazen
