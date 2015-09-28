exports.index = function(req, res){
  res.render('index', { title: 'Smart Park' });
};

exports.notfound = function(req, res) {
	res.status(404).format({
		html : function() {
			res.render('404', {
				title : '404 Not found'
			});
		},
		json : function() {
			res.send({
				message : 'Resource not found'
			});
		},
		xml : function() {
			res.res.write('<error>\n');
			res.res.write('<message>Resource not found</message>\n');
			res.res.write('</error>\n');
		},
		text : function() {
			res.send('Resource not found\n');
		}
	});

};

exports.error = function(err, req, res, next) {
	console.error(err.stack);

	res.statusCode = 500;

	res.render('5xx', {
		title : 'Internal Server Error',
		msg : err.message,
		status : res.statusCode,
		stack : err.stack
	});

};