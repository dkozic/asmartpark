var NfcClient = require('../bindings/nfc/nfcclient');

exports.view = function(req, res, next) {
	
	var nfcClient = new NfcClient("172.25.0.19", 4001);
	nfcClient.getDateTime(function(data) {
		if (data instanceof Error) {
			return next(data);
		}
		res.render('nfc', {
			title : 'NFC',
			dateTime : data
		});
	});
	
};
