var YR8600Client = require('../bindings/yr8600/yr8600client');

var IP = "172.25.0.195";
var PORT = 4001;

var yr8600Client = new YR8600Client(IP, PORT);


var errorCodes = {
	"0x0010" : {code: '0x10', name: "CommandSuccess", description: "Command succeeded."},
	"0x0011" : {code: '0x11', name: "command_fail", description: "Command failed."},
	"0x0020" : {code: '0x20', name: "mcu_reset_error", description: "CPU reset error."},
	"0x0021" : {code: '0x21', name: "cw_on_error", description: "Turn on CW error."},
	"0x0022" : {code: '0x22', name: "antenna_missing_error", description: "Antenna is missing."},
	"0x0023" : {code: '0x23', name: "write_flash_error", description: "Write flash error."},
	"0x0024" : {code: '0x24', name: "read_flash_error", description: "Read flash error."},
	"0x0025" : {code: '0x25', name: "set_output_power_error", description: "Set output power error."}
};

function dec2hex(i) {
	return "0x" + (i + 0x10000).toString(16).substr(-4).toUpperCase();
}

function resolveError(errorCode){
	var hexErrorCode = dec2hex(errorCode);
	for (var ec in errorCodes) {
		if (ec == hexErrorCode) {
			return errorCodes[ec];
		}
	}
	return null;
}
exports.view = function(req, res) {

	res.render('yr8600', {
		title : 'YR8600'
	});
};

exports.getFirmwareVersion = function(req, res, next) {

	yr8600Client.getFirmwareVersion(function(error, command, response) {
		if (error) {
			return next(error);
		}
		var getFirmwareVersion = {};
		getFirmwareVersion.major = response.fields.major;
		getFirmwareVersion.minor = response.fields.minor;

		res.render('yr8600', {
			title : 'YR8600',
			command: command,
			response: response,
			getFirmwareVersion : getFirmwareVersion
		});
	});
};

exports.getWorkAntenna = function(req, res, next) {

	yr8600Client.getWorkAntenna(function(error, command, response) {
		if (error) {
			return next(error);
		}
		var getWorkAntenna = {};
		getWorkAntenna.antenna1 = response.fields.antenna == 0;
		getWorkAntenna.antenna2 = response.fields.antenna == 1;
		getWorkAntenna.antenna3 = response.fields.antenna == 2;
		getWorkAntenna.antenna4 = response.fields.antenna == 3;

		res.render('yr8600', {
			title : 'YR8600',
			command: command,
			response: response,
			getWorkAntenna : getWorkAntenna
		});
	});
};

exports.setWorkAntenna = function(req, res, next) {

	var workAntenna = req.query.workAntenna;
	console.log("workAntenna request param: " + workAntenna);

	//validation
	req.assert('workAntenna', 'workAntenna is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		res.render('yr8600', {
			title: 'YR8600',
			workAntenna: workAntenna
		});
	} else {

		yr8600Client.setWorkAntenna(function(error, command, response) {
			if (error) {
				return next(error);
			}

			var setWorkAntenna = resolveError(response.fields.errorCode);

			res.render('yr8600', {
				title : 'YR8600',
				command: command,
				response: response,
				workAntenna : workAntenna,
				setWorkAntenna: setWorkAntenna
			});
		}, workAntenna);
	}
};
