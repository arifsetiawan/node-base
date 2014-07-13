
module.exports = function(app, collectionName) {

  var insert = function (data, cb) {

    app.db.collection(collectionName, function(err, collection) { 
      if (err) {
        cb(err);
      }
      else {
        collection.insert(data, { safe: true }, function(err, cursor) {
          if (err) {
            cb(err);
          }
          else {
            cb(null, cursor[0]);
          }
        }); 
      }
    });
  }

  var upsert = function (check, update, data, cb) {

    app.db.collection(collectionName, function(err, collection) {     
      if (err) {
        cb(err);
      } 
      else {
        collection.update( check, {$set: data}, { upsert: true }, function(err, count) {
          if (err) {
            cb(err);
          }
          else {
            cb(null, data);  
          }
        });
      }
    });
  }

  var update = function(check, update, data, cb) {

    app.db.collection(collectionName, function(err, collection) {     
      if (err) {
        cb(err);
      } 
      else {
        collection.update( check, update, { safe: true, multi: true }, function(err, count) {
          if (err) {
            cb(err);
          }
          else {
            cb(null, data);  
          }
        });
      }
    });
  }

  var list = function (query, cb) {

    app.db.collection(collectionName, function(err, collection) { 
      if (err) {
        cb(err);
      }
      else {
        collection.find(query).toArray(cb);
      }
    });
  }

  var listWithParam = function (query, param, cb) {

    app.db.collection(collectionName, function(err, collection) { 
      if (err) {
        cb(err);
      }
      else {
        collection.find(query,param).toArray(cb);
      }
    });
  }

  var findOne = function(query, cb) {

    app.db.collection(collectionName, function(err, collection) { 
      if (err) {
        cb(err);
      }
      else {
        collection.findOne(query, cb);
      }
    });
  }

  var remove = function(query, cb) {

    app.db.collection(collectionName, function(err, collection) { 
      if (err) {
        cb(err);
      }
      else {
        collection.remove(query, cb);
      }
    });
  }

  var drop = function(cb) {
    app.db.dropCollection(collectionName, cb);
  }

  var count = function(query, cb) {
    app.db.collection(collectionName, function(err, collection) { 
      if (err) {
        cb(err);
      }
      else {
        collection.count(query, function(err, count) {
          if (err) {
            cb(null, -1);
          }
          else {
            cb(null, count);
          }
        });
      }
    });
  }

  return {
    insert: insert,
    upsert: upsert,
    update: update,
    list: list,
    listWithParam: listWithParam,
    findOne: findOne,
    remove: remove,
    drop: drop,
    count: count
  }

}