
module.exports = function(app) {

  var insert = function (collectionName, data, cb) {

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

  var upsert = function (collectionName, check, data, cb) {

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

  var update = function(collectionName, check, update, data, cb) {

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

  var list = function (collectionName, query, cb) {

    app.db.collection(collectionName, function(err, collection) { 
      if (err) {
        cb(err);
      }
      else {
        collection.find(query).toArray(cb);
      }
    });
  }

  var listWithParam = function (collectionName, query, param, cb) {

    app.db.collection(collectionName, function(err, collection) { 
      if (err) {
        cb(err);
      }
      else {
        collection.find(query,param).toArray(cb);
      }
    });
  }

  var findOne = function(collectionName, query, cb) {

    app.db.collection(collectionName, function(err, collection) { 
      if (err) {
        cb(err);
      }
      else {
        collection.findOne(query, cb);
      }
    });
  }

  var findN = function(collectionName, query, sort, skip, limit, cb) {
    //db.collection.find().sort( { _id : -1 } ).limit(1);
    app.db.collection(collectionName, function(err, collection) { 
      if (err) {
        cb(err);
      }
      else {
        collection.find(query).sort(sort).skip(skip).limit(limit).toArray(cb);
      }
    });
  }

  var remove = function(collectionName, query, cb) {

    app.db.collection(collectionName, function(err, collection) { 
      if (err) {
        cb(err);
      }
      else {
        collection.remove(query, cb);
      }
    });
  }

  var drop = function(collectionName, cb) {
    app.db.dropCollection(collectionName, cb);
  }

  var count = function(collectionName, query, cb) {
    app.db.collection(collectionName, function(err, collection) { 
      if (err) {
        cb(err);
      }
      else {
        collection.count(query, cb);
      }
    });
  }

  var collection = function(collectionName, cb) {
    app.db.collection(collectionName, cb);
  }

  return {
    insert: insert,
    upsert: upsert,
    update: update,
    list: list,
    listWithParam: listWithParam,
    findOne: findOne,
    findN: findN,
    remove: remove,
    drop: drop,
    count: count,
    collection: collection
  }

}