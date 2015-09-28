var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var VError = require('verror');
var log = require('../lib/log')('/app');

function DbManager() {
	this.file = "smartpark.db";
	this.openDatabase = function() {
		var exists = fs.existsSync(this.file);
		if (!exists) {
			log.debug("Creating DB file.");
			fs.openSync(this.file, "w");
		}
		var db = new sqlite3.Database(this.file);
		return db;
	};
}

DbManager.prototype.insert = function(data) {

	var db = this.openDatabase();

	db
			.serialize(function() {
				var sql = "CREATE TABLE IF NOT EXISTS parkingplacelog (id INTEGER PRIMARY KEY, parkingplace TEXT, state INTEGER, timestamp TEXT)";
				db.run(sql);

				sql = "CREATE INDEX IF NOT EXISTS x_parkingplacelog1 on parkingplacelog(parkingplace)";
				db.run(sql);

				sql = "INSERT INTO parkingplacelog VALUES (NULL, ?, ?, ?)";
				db.run(sql, data.id, data.state, data.stateTimestamp);
			});
	db.close();
};

DbManager.prototype.findByParkinglace = function(pp, handler) {

	var db = this.openDatabase();

	var sql = "SELECT * FROM parkingplacelog WHERE parkingplace = ? ORDER BY timestamp DESC";
	db.all(sql, [ pp ], handler);
	db.close();
};

module.exports = DbManager;
