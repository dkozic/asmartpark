var util = require("util");
var NfcClient = require("./nfcclient");
var EventEmitter = require("events").EventEmitter;

function NfcBinding(host, port, pollingInterval) {
	EventEmitter.call(this);
	this.host = host;
	this.port = port;
	this.pollingInterval = pollingInterval;
	this.nfcClient = new NfcClient(this.host, this.port);
}

util.inherits(NfcBinding, EventEmitter);

NfcBinding.prototype.start = function() {
	var self = this;
	setInterval(function() {
		//console.log('Polling event...start');
		//self.nfcClient.getDateTime();
		//self.nfcClient.getFirmwareVersion();
		//console.log('Polling event...end');
		
	}, this.pollingInterval);
};

module.exports = NfcBinding;
