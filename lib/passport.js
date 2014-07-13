
module.exports = function (app, passport) {

  var _ = require('lodash');
  var LocalStrategy = require('passport-local').Strategy;
  
  var User = require('../models/user')(app);

  // passport setup
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({_id: app.ObjectID(id)}, function (err, user) {
      var a = _.omit(user, 'password');
      done(null, a);
    });
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.isValidUserPassword(username, password, done);
    })
  );

}