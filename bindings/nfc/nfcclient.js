var net = require('net');
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var Struct = require('struct').Struct;

function NfcClient(host, port) {
	this.host = host;
	this.port = port;
}

util.inherits(NfcClient, EventEmitter);

// callCommand
NfcClient.prototype.callCommand = function(buildCommand, parseResponse, callback, buildCommandData) {
	var self = this;
	var client = new net.Socket();

	client.connect(self.port, self.host, function() {
		console.log('Connected to: ' + self.host + ':' + self.port);
	});

	var command = buildCommand(buildCommandData);
	var commandBuffer = command.buffer();
	console.log("command:");
	console.log(commandBuffer);
	client.write(commandBuffer);

	// Add a 'close' event handler for the client socket
	client.on('close', function() {
		console.log('Connection closed');
	});

	// Add a 'error' event handler for the client socket
	client.on('error', function(error) {
		console.log('Error: ' + error);
		callback(error);
	});

	var responseBuffer = new Buffer(0, 'hex');

	client.on('data', function(data) {

		// pack incoming data into the buffer
		responseBuffer = Buffer.concat([ responseBuffer, new Buffer(data, 'hex') ]);
		if (parseResponse) {
			var response = parseResponse(responseBuffer);
			console.log("response:");
			console.log(responseBuffer);
			callback(response);
		} else {
			callback();
		}

		// Close the client socket completely
		client.destroy();

	});
};

function buildSimpleCommand(packetType, stationNum, length, commandCode, checkSum) {
	var command = new Struct().word8('packetType').word8('stationNum').word8('length').word8('commandCode').word8(
			'checkSum');
	command.allocate();
	var buffer = command.buffer();
	buffer.fill(0);
	// console.log(buffer);

	var proxy = command.fields;
	proxy.packetType = packetType;
	proxy.stationNum = stationNum;
	proxy.length = length;
	proxy.commandCode = commandCode;
	proxy.checkSum = checkSum;
	// console.log(buffer);

	return command;
}

// GetDateTime
NfcClient.prototype.getDateTime = function(callback) {
	var self = this;
	self.callCommand(buildGetDateTimeCommand, parseGetDateTimeResponse, callback);
}

function buildGetDateTimeCommand() {
	return buildSimpleCommand(0xA5, 0xFF, 2, 0x49, 0); 
}

function parseGetDateTimeResponse(buffer) {
	var response = new Struct().word8('packetType').word8('stationNum').word8('length').word8('responseCode').array(
			"responseData", 'word8', 8).word8('checkSum');

	response._setBuff(buffer);
	return response;
};

// GetFirmwareVersion
NfcClient.prototype.getFirmwareVersion = function(callback) {
	var self = this;
	self.callCommand(buildGetFirmwareVersionCommand, parseGetFirmwareVersionResponse, callback);
}

function buildGetFirmwareVersionCommand() {
	return buildSimpleCommand(0xA5, 0xFF, 2, 0x7A, 0); 
}

function parseGetFirmwareVersionResponse(buffer) {

	var response = new Struct().word8('packetType').word8('stationNum').word8('length').word8('responseCode').array(
			"responseData", 'word8', 4).word8('checkSum');

	response._setBuff(buffer);
	return response;
};

// parse completion response
function parseCompletionResponse(buffer) {

	var response = new Struct().word8('packetType').word8('stationNum').word8('length').word8('commandCode').word8(
			'status').word8('checkSum');

	response._setBuff(buffer);
	return response;
};

// ResetReader
NfcClient.prototype.resetReader = function(callback) {
	var self = this;
	self.callCommand(buildResetReaderCommand, parseCompletionResponse, callback);
}

function buildResetReaderCommand() {
	return buildSimpleCommand(0xA5, 0xFF, 2, 0x75, 0); 
}

// ResetReader
NfcClient.prototype.stopRFWork = function(callback) {
	var self = this;
	self.callCommand(buildStopRFWorkCommand, parseCompletionResponse, callback);
}

function buildStopRFWorkCommand() {
	return buildSimpleCommand(0xA5, 0xFF, 2, 0x60, 0); 
}

// startRFWork
NfcClient.prototype.startRFWork = function(callback) {
	var self = this;
	self.callCommand(buildStartRFWorkCommand, parseCompletionResponse, callback);
}

function buildStartRFWorkCommand() {
	return buildSimpleCommand(0xA5, 0xFF, 2, 0x62, 0); 
}

// getTrigState
NfcClient.prototype.getTrigState = function(callback) {
	var self = this;
	self.callCommand(buildGetTrigStateCommand, parseGetTrigStateResponse, callback);
}

function buildGetTrigStateCommand() {
	return buildSimpleCommand(0xA5, 0xFF, 2, 0x56, 0); 
}

function parseGetTrigStateResponse(buffer) {

	var response = new Struct().word8('packetType').word8('stationNum').word8('length').word8('responseCode').word8(
			'responseData').word8('checkSum');

	response._setBuff(buffer);
	return response;
};

// getRelayState
NfcClient.prototype.getRelayState = function(callback) {
	var self = this;
	self.callCommand(buildGetRelayStateCommand, parseGetRelayStateResponse, callback);
}

function buildGetRelayStateCommand() {
	return buildSimpleCommand(0xA5, 0xFF, 2, 0x58, 0); 
}

function parseGetRelayStateResponse(buffer) {

	var response = new Struct().word8('packetType').word8('stationNum').word8('length').word8('responseCode').word8(
			'responseData').word8('checkSum');

	response._setBuff(buffer);
	return response;
};

//getRelayState
NfcClient.prototype.masterAcknowledge = function(callback) {
	var self = this;
	self.callCommand(buildMasterAcknowledgeeCommand, null, callback);
}

function buildMasterAcknowledgeeCommand() {
	return buildSimpleCommand(0xA5, 0xFF, 2, 0x80, 0); 
}

module.exports = NfcClient;
