
module.exports = function(app, passport) {

  var config = require('../config/app');
  var User = require('../models/user')(app);

  var signin = function(req, res) {

    if (typeof(req.body.username) !== "undefined") {
      passport.authenticate('local', {
        successRedirect: req.session.returnTo ? config.serverPath + req.session.returnTo : req.session.goingTo ? config.serverPath + req.session.goingTo : config.serverPath + '/home',
        failureRedirect: config.serverPath + '/signin',
        failureFlash: true
      })(req, res);
    }
    else {
      var model = config.page;
      model.userLogin = false;
      model.messages = req.flash('error');
      res.render('signin', model);
    }
  }

  var index = function(req, res) {

    var model = config.page;
    model.userLogin = false;
    res.render('index', model);
  }

  var signout = function(req, res) {

    req.logout();
    res.redirect(config.serverPath + '/signin');
  }

  return {
    signin: signin,
    index: index,
    signout: signout
  }

};