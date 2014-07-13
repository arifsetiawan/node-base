
var config = require('../config/app');

exports.isAuthenticated = function (role) {

  return function (req, res, next) {

    if (!req.isAuthenticated()) {
      req.session.goingTo = req.url;
      res.redirect(config.serverPath + '/login');
      return;
    }

    if (role && req.user.role !== role) {
      res.status(401);
      res.render('errors/401');
      return;
    }
    
    next();
  };
};