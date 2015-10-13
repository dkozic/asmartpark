var TinynodeBinding = require("./bindings/tinynode/tinynodebinding");
var NfcBinding = require("./bindings/nfc/nfcbinding");
var logger = require("./components/logger");
var Repository = require("./components/repository");
var config = require('config');
var DbManager = require('./components/dbmanager');
var log = require('./lib/log')('/app');

function init(app, io) {
	var url = config.get('tinynode.url');
	var pollingInterval = config.get('tinynode.pollingInterval');
	var tinynodeBinding = new TinynodeBinding(url, pollingInterval);

	tinynodeBinding.on('data', logger.onBindingData);

	var parkingPlacesNo = config.get("repository.parkingPlacesNo");
	var repo = new Repository(parkingPlacesNo);
	repo.on('data', function(data) {
		io.sockets.emit('data', data);
	});
	
	var dbManager = new DbManager();
	repo.on('data', function(data) {
		dbManager.insert(data);
	});
	

	tinynodeBinding.on('data', repo.onBindingData);

	tinynodeBinding.start();
	
	
	var nfcBinding = new NfcBinding("172.25.0.19", 4001, pollingInterval);
	nfcBinding.start();
	
	app.locals.repository = repo;
}

exports.init = init;