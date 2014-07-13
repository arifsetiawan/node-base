
module.exports = function(app) {

  var _ = require('lodash');
  var async = require('async');
  var bcrypt = require('bcryptjs');
  
  var utils = require('../lib/utils');

  var collectionName = 'users'
  var generic = require('./generic')(app, collectionName);

  var insert = function (data, role, cb) {
    async.waterfall([
      function(cbi){
        validateUserData(data, role, cbi);
      },
      function(data, cbi){
        app.db.collection('users', function(err, collection) { 
          if (err) {
            cbi(err);
          }
          else {
            collection.findOne({username: data.username}, function(err, cursor) {
              if (err) {
                cbi(err)
              }
              else {
                cbi(null, cursor, data, collection)
              }
            }) 
          }
        });
      },
      function(cursor, data, collection, cbi){
        if (cursor) {
          cbi(new Error('User ' + data.username + ' already exists'), cursor);
        }
        else {

          var hashedPwd = bcrypt.hashSync(data.password, 10);
          data.password = hashedPwd;

          collection.insert(data, { safe: true }, function(err, cursor) {
            if (err) {
              cbi(err);
            }
            else {
              cbi(null, cursor[0]);
            }
          });
        }
      }
    ], function (err, result) {
      if (err) {
        cb(err)
      }
      else {
        cb(null, result);
      }    
    });
  }

  var passwordMatches = function(user, plainText) {

    var match = bcrypt.compareSync(plainText, user.password);
    return match;
  }

  var isValidUserPassword = function(username, password, done) {
    
    generic.findOne({username: username}, function (err, user) {

      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'Username not found' });
      }

      if (!passwordMatches(user, password)) {
        return done(null, false, { message: 'Incorrect Password' });
      }

      done(null, user);
    });
  }

  function validateUserData(data, role, cb) {

    // email is username. in some cases you might want to have unique username too
    if (!utils.hasProperty(data, ['username','password1','password1','name'])) {
      return cb(new Error('Required registration property is not available'));
    }

    var a = _.omit(data, '_csrf');

    if(a.password1 !== a.password2) {
      return cb(new Error('Password is not match'));
    }

    var a = _.omit(a, 'password1');
    var a = _.omit(a, 'password2');

    a.password = data.password1;
    a.role = role;
    a.ts = new Date();
    a.tm = new Date();

    var emailRe = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
    if (!emailRe.test(a.username)) {
      return cb(new Error('Username is not valid format'));
    }

    var passwordRe = /^[a-z0-9_!@#$%&*-]{6,20}$/; ///^((?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%&*_-]{6,20})$/;
    if (!passwordRe.test(a.password1)) {
      return cb(new Error('Password must be 6 to 20 alpha numeric character length. Allowed : _,-,!,@,#,$,%,&,*'));
    }

    return cb(null, a);
  }

  return {
    insert: insert,
    findOne: generic.findOne,
    list: generic.list,
    isValidUserPassword: isValidUserPassword
  }

}