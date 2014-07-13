
module.exports = function(app, passport) {

  var config = require('../config/app');
  var auth = require('../middleware/auth');

  var session = require('../controllers/session')(app, passport);
  var home = require('../controllers/home')(app);
  
  app.get('/', session.index);
  app.get(config.webPrefix + '/signin', session.signin);
  app.get(config.webPrefix + '/signout', session.signout);
  app.post(config.webPrefix + '/signin', session.signin);

  app.get(config.webPrefix + '/home', auth.isAuthenticated(), home.index);
}
