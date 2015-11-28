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

exports.getParameterRSSI = function(req, res, next) {

	nfcClient.getParameterRSSI(function(error, command, response) {
		if (error) {
			return next(error);
		}
		var getParameterRSSI = {};
		getParameterRSSI.addrH = response.fields.addrH;
		getParameterRSSI.addrL = response.fields.addrL;
		getParameterRSSI.parameter = response.fields.parameter;

		res.render('nfc', {
			title : 'NFC',
			command: command,
			response: response,
			getParameterRSSI : getParameterRSSI
		});
	});

};

exports.setParameterRSSI = function(req, res, next) {
	var parameterRSSI = req.query.parameterRSSI;
	console.log("parameterRSSI request param: " + parameterRSSI);

	//validation
	req.assert('parameterRSSI', 'parameterRSSI is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		res.render('nfc', {
			title: 'NFC',
			parameterRSSI: parameterRSSI
		});
	} else {

		nfcClient.setParameterRSSI(function(error, command, response) {
			if (error) {
				return next(error);
			}
			res.render('nfc', {
				title : 'NFC',
				command: command,
				response: response,
				parameterRSSI : parameterRSSI,
				setParameterRSSI: "DONE"
			});
		}, parameterRSSI);
	}

};

exports.getParameterRefresh = function(req, res, next) {

	nfcClient.getParameterRefresh(function(error, command, response) {
		if (error) {
			return next(error);
		}
		var getParameterRefresh = {};
		getParameterRefresh.addrH = response.fields.addrH;
		getParameterRefresh.addrL = response.fields.addrL;
		getParameterRefresh.parameter = response.fields.parameter;

		res.render('nfc', {
			title : 'NFC',
			command: command,
			response: response,
			getParameterRefresh : getParameterRefresh
		});
	});

};

exports.setParameterRefresh = function(req, res, next) {
	var parameterRefresh = req.query.parameterRefresh;
	console.log("parameterRefresh request param: " + parameterRefresh);

	//validation
	req.assert('parameterRefresh', 'Refresh interval je obavezan').notEmpty();
	req.assert('parameterRefresh', 'Duzina od Refresh interval nije dobra. Mora biti od 1 do 5').len(1, 5);
	req.assert('parameterRefresh', 'Refresh interval mora biti sastavljen od cifara').matches(/[0-9]/);
	req.assert('parameterRefresh', 'Refresh interval mora biti ceo broj').isInt();

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		res.render('nfc', {
			title: 'NFC',
			parameterRefresh: parameterRefresh
		});
	} else {

		nfcClient.setParameterRefresh(function(error, command, response) {
			if (error) {
				return next(error);
			}
			res.render('nfc', {
				title : 'NFC',
				command: command,
				response: response,
				parameterRefresh : parameterRefresh,
				setParameterRefresh: "DONE"
			});
		}, parameterRefresh);
	}

};

exports.getIDBuffer = function(req, res, next) {

	nfcClient.getIDBuffer(function(error, command, response) {
		if (error) {
			return next(error);
		}
		var getIDBuffer = {};
		getIDBuffer.tagCount = response.fields.tagCount;
		if (getIDBuffer.tagCount == 1) {
			getIDBuffer.tagResponseData = {};
			getIDBuffer.tagResponseData.tagType = response.fields.tagResponseData[0].tagType;
			getIDBuffer.tagResponseData.tagState1 = response.fields.tagResponseData[0].tagState1;
			getIDBuffer.tagResponseData.tagState2 = response.fields.tagResponseData[0].tagState2;
			getIDBuffer.tagResponseData.tagData = response.fields.tagResponseData[0].tagData;
		} else {
			getIDBuffer.tagResponseData = {};
		}

		res.render('nfc', {
			title : 'NFC',
			command: command,
			response: response,
			getIDBuffer : getIDBuffer
		});
	});

};

