var net = require('net');
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var Struct = require('struct').Struct;

function YR8600Client(host, port) {
    this.host = host;
    this.port = port;
}

util.inherits(YR8600Client, EventEmitter);

// callCommand
YR8600Client.prototype.callCommand = function (buildCommand, parseResponse, callback, buildCommandData) {
    var self = this;
    var client = new net.Socket();

    client.connect(self.port, self.host, function () {
        console.log('Connected to: ' + self.host + ':' + self.port);
    });

    var command = buildCommand(buildCommandData);
    var commandBuffer = command.buffer();
    console.log("command:");
    console.log(commandBuffer);
    client.write(commandBuffer);

    // Add a 'close' event handler for the client socket
    client.on('close', function () {
        console.log('Connection closed');
    });

    // Add a 'error' event handler for the client socket
    client.on('error', function (error) {
        console.log('Error: ' + error);
        callback(error);
    });

    var responseBuffer = new Buffer(0, 'hex');

    client.on('data', function (data) {

        // pack incoming data into the buffer
        responseBuffer = Buffer.concat([responseBuffer, new Buffer(data, 'hex')]);
        if (parseResponse) {
            var response = parseResponse(responseBuffer);
            console.log("response:");
            console.log(responseBuffer);
            callback(null, command, response);
        } else {
            callback(null, command);
        }

        // Close the client socket completely
        client.destroy();

    });
};

function checksum(buffer) {
    var i, uSum = 0;
    for(i = 0; i < buffer.length; i++)
    {
        uSum = uSum + buffer[i];
    }
    uSum = (~uSum) + 1;
    return uSum;
}

function buildSimpleCommand(head, len, address, cmd, check) {
    var command = new Struct().word8('head').word8('len').word8('address').word8('cmd').word8('check');
    command.allocate();
    var buffer = command.buffer();
    buffer.fill(0);
    // console.log(buffer);

    var proxy = command.fields;
    proxy.head = head;
    proxy.len = len;
    proxy.address = address;
    proxy.cmd = cmd;
    proxy.check = check;

    proxy.check = checksum(buffer);
    // console.log(buffer);

    return command;
}

// parse completion response
function parseCompletionResponse(buffer) {

    var response = new Struct().word8('head').word8('len').word8('address').word8('cmd').word8(
        'errorCode').word8('check');

    response._setBuff(buffer);
    return response;
}
// getFirmwareVersion
YR8600Client.prototype.getFirmwareVersion = function (callback) {
    var self = this;
    self.callCommand(buildGetFirmwareVersionCommand, parseGetFirmwareVersionResponse, callback);
};

function buildGetFirmwareVersionCommand() {
    return buildSimpleCommand(0xA0, 0x03, 0xFF, 0x72, 0x00);
}

function parseGetFirmwareVersionResponse(buffer) {
    var response = new Struct().word8('head').word8('len').word8('address').word8('cmd').word8('major')
        .word8('minor').word8('check');

    response._setBuff(buffer);
    return response;
}

// getWorkAntenna
YR8600Client.prototype.getWorkAntenna = function (callback) {
    var self = this;
    self.callCommand(buildGetWorkAntennaCommand, parseGetWorkAntennaResponse, callback);
};

function buildGetWorkAntennaCommand() {
    return buildSimpleCommand(0xA0, 0x03, 0xFF, 0x75, 0x00);
}

function parseGetWorkAntennaResponse(buffer) {
    var response = new Struct().word8('head').word8('len').word8('address').word8('cmd').word8('antenna').word8('check');

    response._setBuff(buffer);
    return response;
}

// setWorkAntenna
YR8600Client.prototype.setWorkAntenna = function (callback, workAntenna) {
    var self = this;
    self.callCommand(buildSetWorkAntennaCommand, parseCompletionResponse, callback, workAntenna);
};

function buildSetWorkAntennaCommand(workAntenna) {
    var command = new Struct().word8('head').word8('len').word8('address').word8('cmd').word8('workAntenna').word8('check');
    command.allocate();
    var buffer = command.buffer();
    buffer.fill(0);
    var proxy = command.fields;
    proxy.head = 0xA0;
    proxy.len = 0x04;
    proxy.address = 0xFF;
    proxy.cmd = 0x74;
    proxy.workAntenna = workAntenna;
    proxy.check = 0x00;

    proxy.check = checksum(buffer);

    return command;
}

module.exports = YR8600Client;
