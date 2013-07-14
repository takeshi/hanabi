'use strict';

angular.module('hanabiApp')
  .factory('fieldDao', function(db, Dao) {
  var dao = new Dao('Field', db);

  dao.insert = function(params, callback) {
    var sql = 'insert into Field values(?,?)';
    db.execute(sql, params, function(err, result) {
      if (err) {
        callback(err);
        return;
      }
      dao.lastInsertRowId(function(err, result) {
        callback(err, result);
      });

    });
  };
  var batchInsert = function(fields, callback, results) {
    var field = fields.pop();
    dao.insert(field, function(err, data) {
      if (err) {
        callback(err);
        return;
      }
      results.push(data);
      if (fields.length === 0) {
        callback(err, results);
        return;
      }
      batchInsert(fields, callback, results);
    });

  };
  dao.batchInsert = function(fields, callback) {
    batchInsert(fields, callback, []);
  };

  return dao;
});