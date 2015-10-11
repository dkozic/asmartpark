var bunyan = require('bunyan');

module.exports = function(logName) {
	var log = bunyan.createLogger({
		name : logName,
		streams : [ {
			stream : process.stdout,
			level : 'info'
		}, {
			path : 'asmartpark.log',
			level : 'debug'
		} ],
		serializers : bunyan.stdSerializers
	});
	return log;
};
