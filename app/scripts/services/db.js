'use strict';

var db = window.db = openDatabase('hanabi', '', 'hanabi app', 1048576);


angular.module('hanabiApp')
  .factory('db', function() {

  var execute = function(tx, sql, params, callback) {
    console.log(sql);
    console.log(params);

    if (sql === null || sql.trim().length <= 1) {
      return;
    }
    tx.executeSql(sql, params, function(tx, success) {
      if (callback) {
        var rows = [];
        for (var i = 0; i < success.rows.length; i++) {
          var row = success.rows.item(i);
          rows.push(row);
        }
        console.info(sql, params, tx, rows);
        callback(null, rows);
      } else {
        console.info(sql, params, success);
      }
    }, function(tx, err) {
      console.error(sql, params, err);
      if (callback) {
        callback(err);
      }
    });
  };

  var batchExecute = function(sql, paramsList, callback, eachCallback, results) {
    var params = paramsList.pop();
    if (params === null) {
      callback(null, results);
      return;
    }
    db.execute(sql, params, function(err, result) {
      if (err) {
        callback(err);
        return;
      }
      if (eachCallback) {
        eachCallback(err, result, function(err, result) {
          if (err) {
            callback(err);
            return;
          }
          results.push(result);
          batchExecute(sql, paramsList, callback, results);
        });
      } else {
        results.push(result);
        batchExecute(sql, paramsList, callback, results);
      }
    });
  };

  db.batchExecute = function(sql, paramsList, callback, eachCallback) {
    batchExecute(sql, paramsList, eachCallback, callback, []);
  };

  db.execute = function(sql, params, callback) {
    db.transaction(function(tx) {
      execute(tx, sql, params, callback);
    });
  };

  return window.db;
});