var repository = require("../components/repository");

exports.view = function(req, res, next) {

	res.render('dashboard', {
		title : 'Dashboard',
		repository : req.app.locals.repository
	});
};
