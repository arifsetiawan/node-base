
module.exports = function() {

  var MongoClient = require('mongodb').MongoClient;
  var Server = require('mongodb').Server;
  
  var open = function(conf, cb) {
    MongoClient.connect('mongodb://'+ conf.host + ':' + conf.port +'/' + conf.dbname, function(err, db) {
      if (err) {
        console.error('Failed to connect to database', dbname, err);
        cb(err);
      }
      else {
        cb(null, db);
      }
    });
  }

  return {
    open: open
  }

};