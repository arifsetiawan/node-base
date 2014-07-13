
module.exports = function(app) {

  var config = require('../config/app');
  
  var index = function(req, res) {

    var model = config.page;
    model.username = req.user.username;
    model.userLogin = true;
    res.render('home', model);
  }

  return {
    index: index
  }

};