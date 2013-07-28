'use strict';

var db = window.db = openDatabase('hanabi', '', 'hanabi app', 1048576);


angular.module('hanabiApp')
  .factory('db', function() {

  var execute = function(tx, sql, params, callback) {
    // console.log(sql);
    // console.log(params);

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

  var batchExecute = function(tx,sql, paramsList, callback, results) {
    if (paramsList.length === 0) {
      if (callback) {
        callback(null, results);
      }
      return;
    }
    var params = paramsList.pop();
    tx.execute(sql, params, function(err, result) {
      if (err) {
        callback(err);
        return;
      }
      results.push(result);
      batchExecute(tx,sql, paramsList, callback, results);
    });
  };

  db.tx = function(callback) {
    db.transaction(function(tx) {
      tx.execute = function(sql, params, callback) {
        execute(tx, sql, params, callback);
      };
      callback(tx);
    });
  };
  db.batchExecute = function(sql, paramsList, callback) {
    db.tx(function(tx){
      batchExecute(tx,sql, paramsList, callback, []);
    });
  };

  db.execute = function(sql, params, callback) {
    db.transaction(function(tx) {
      execute(tx, sql, params, callback);
    });
  };

  return window.db;
});