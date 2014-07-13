
var app = {};

var db = require('../lib/database')();
var config = require('../config/app');
var User = require('../models/user')(app);

db.open(config.mongodb, function(err, db) {
  if (err) {
    console.error(err);
  }
  else {
    app.db = db;

    var userData = {
      username : 'youremail@mail.com',
      password1 : 'test1234',
      password2 : 'test1234',
      name : 'User test',
      avatar: '',
      active: 'true'
    }

    User.insert(userData, ['admin'], function(err, data) {
      if (err) {
        console.error(err);
      }
      else {
        console.log(data);
      }
    })
  }
});