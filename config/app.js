
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

// init dirs - for formidable multipart
var uploadDir = process.env.PORT ? 'D:/Uploadir/' : 'C:/Node/Uploadir/'
if (!fs.existsSync(uploadDir)) 
  mkdirp.sync(uploadDir);

// app
var appName = 'Node.js Base App'

var port = process.env.PORT ? process.env.PORT : 3000;
var webPrefix = '';
var staticHost = process.env.PORT ? 'base.node.me/public' : 'localhost:' + port;
var serverIp = process.env.PORT ? 'base.node.me' : 'localhost:' + port;
var serverPath = process.env.PORT ? 'base.base.me' + webPrefix : 'localhost:'+port+webPrefix;
var runOnLocal = process.env.PORT ? false : true;

module.exports = {

  // page settings
  page : {
    staticHost: staticHost,
    serverIp: serverIp,
    runOnLocal: runOnLocal,
    serverPath: serverPath,
    appName: appName,
  },

  serverPath: 'http://' + serverPath,
  runOnLocal: runOnLocal,
  webPrefix: webPrefix,
  port: port,
  staticHost: staticHost,
  appName: appName,

  // dir
  uploadDir : uploadDir,

  // database
  mongodb : {
    host: 'localhost',
    port: '27017',
    dbname: 'base'
  }

}