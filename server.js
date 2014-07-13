
require("console-stamp")(console, "isoDateTime");

var express = require('express');
var cons = require('consolidate');
var swig = require('swig');
var passport = require('passport');
var ObjectID = require('mongodb').ObjectID;
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(express);

var config = require('./config/app');

// version
// bump when doing update
var version = '1.0.0'

// express app
var app = express();

// db
var db = require('./lib/database')();

// passport setup
require('./lib/passport')(app, passport);

// express setup
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.session({
  secret: 'MM81BlCNgxPBfpEAU9c3EQCGnSyxehNebpdB8tmRnf2yRn1loto0z9RU0v4ZhNea',
  store: new MongoStore({
    host: config.mongodb.host,
    port: config.mongodb.port,
    db: config.mongodb.dbname
  })
}));

app.use(express.static(__dirname + '/public'));
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// express configuration
app.configure('development', function () {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

// before routes
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
var routes = require('./routes')(app, passport)

// after routes, catch 404 and 500
app.use(function(req, res, next){
  res.status(404);
  var model = config.page;
  model.code = 404;
  model.description = 'Sorry, but this page doesn\'t exists!';
  model.otherdesc = '';
  res.render('errors/error', model);
});

app.use(function(err, req, res, next){
  if (err) {
    console.error(err.stack);
    model.code = 500;
    model.description = 'Don\'t worry, there is a little turbulence!';
    model.otherdesc = 'We\'re trying to fix it, please try again later';
    res.render('errors/error', model);
  }
});

// ups
process.on('uncaughtException',function(err){
  console.error(err.stack);
});

// open connection to db
db.open(config.mongodb, function(err, db) {
  if (err) {
    console.error(err);
  }
  else {
    app.db = db;
    app.ObjectID = ObjectID;

    // start server
    app.listen(config.port);
    console.log(config.appName + ' server version ' + version + ' is running on port : ' + config.port);
  }
});



