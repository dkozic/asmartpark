var net = require('net');
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var Struct = require('struct').Struct;

function NfcClient(host, port) {
	this.host = host;
	this.port = port;
	this.client = null;
}

util.inherits(NfcClient, EventEmitter);

//GetDateTime
NfcClient.prototype.getDateTime = function(callback) {
	var self = this;
	var client = new net.Socket();

	client.connect(self.port, self.host, function() {
		console.log('Connected to: ' + self.host + ':' + self.port);
	});

	var command = buildGetDateTimeCommand();
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
		callback(error)
	});

	var responseBuffer = new Buffer(0, 'hex');

	client.on('data', function(data) {

		// pack incoming data into the buffer
		responseBuffer = Buffer.concat([ responseBuffer, new Buffer(data, 'hex') ]);
		var response = parseGetDateTimeResponse(responseBuffer);
		console.log("response:");
		console.log(responseBuffer);

		// Close the client socket completely
		client.destroy();
		callback(response);

	});
};

function buildGetDateTimeCommand() {
	var command = new Struct().word8('packetType').word8('stationNum').word8('length').word8('commandCode').word8(
			'checkSum');
	command.allocate();
	var buffer = command.buffer();
	buffer.fill(0);
	// console.log(buffer);

	var proxy = command.fields;
	proxy.packetType = 0xA5;
	proxy.stationNum = 0xFF;
	proxy.length = 2;
	proxy.commandCode = 0x49;
	proxy.checkSum = 0;
	// console.log(buffer);

	return command;
}

function parseGetDateTimeResponse(buffer) {

	var response = new Struct().word8('packetType').word8('stationNum').word8('length').word8('responseCode').array(
			"responseData", 'word8', 8).word8('checkSum');

	response._setBuff(buffer);
	return response;
};

//GetFirmwareVersion
NfcClient.prototype.getFirmwareVersion = function() {
	var self = this;
	var client = new net.Socket();

	client.connect(self.port, self.host, function() {
		console.log('Connected to: ' + self.host + ':' + self.port);
	});

	var command = buildGetFirmwareVersionCommand();
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
		connected = false;
		console.log('Error: ' + error);
		// self.emit("error", error);
	});

	var responseBuffer = new Buffer(0, 'hex');

	client.on('data', function(data) {

		// pack incoming data into the buffer
		responseBuffer = Buffer.concat([ responseBuffer, new Buffer(data, 'hex') ]);
		var response = parseGetFirmwareVersionResponse(responseBuffer);
		console.log("response:");
		console.log(responseBuffer);

		// Close the client socket completely
		client.destroy();
		// self.emit("data", data);

	});
};

function buildGetFirmwareVersionCommand() {
	var command = new Struct().word8('packetType').word8('stationNum').word8('length').word8('commandCode').word8(
			'checkSum');
	command.allocate();
	var buffer = command.buffer();
	buffer.fill(0);
	// console.log(buffer);

	var proxy = command.fields;
	proxy.packetType = 0xA5;
	proxy.stationNum = 0xFF;
	proxy.length = 2;
	proxy.commandCode = 0x7A;
	proxy.checkSum = 0;
	// console.log(buffer);

	return command;
}

function parseGetFirmwareVersionResponse(buffer) {

	var response = new Struct().word8('packetType').word8('stationNum').word8('length').word8('responseCode').array(
			"responseData", 'word8', 4).word8('checkSum');

	response._setBuff(buffer);
	return response;
};

module.exports = NfcClient;
